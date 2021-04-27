/* eslint-disable */
function addFilteredReferenceDataListeners(assessmentUuid, episodeUuid) {
  var state = {}
  var dynamicElements = document.querySelectorAll('[data-is-dynamic]')

  function targetHasValues(state) {
    var requiredQuestions = Object.keys(state.requiredValues)
    for (var i = 0; i < requiredQuestions.length; i++) {
      var key = requiredQuestions[i]
      if (state.requiredValues[key] && !state.targetValues[key]) {
        return false
      }
    }
    return true
  }

  function isRadio(element) {
    return element.dataset.questionType === 'radio'
  }
  function isDropdown(element) {
    return element.dataset.questionType === 'dropdown'
  }

  function clearDropdown(element) {
    while (element.options.length > 0) {
      element.remove(0)
    }
  }

  function clearRadio(element) {
    element.replaceChildren()
  }

  function removeExistingOptions(element) {
    if (isRadio(element)) {
      return clearRadio(element)
    }
    if (isDropdown(element)) {
      return clearDropdown(element)
    }
    return
  }

  function createDropdownOptions(dropdown, options) {
    for (var i = 0; i < options.length; i++) {
      var option = options[i]

      var optionElement = document.createElement('option')
      optionElement.text = option.text
      optionElement.value = option.value

      dropdown.add(optionElement)
    }
  }

  function createRadioOptions(radioGroup, options) {
    for (var i = 0; i < options.length; i++) {
      var option = options[i]

      var radioItem = document.createElement('div')
      radioItem.className = 'govuk-radios__item'

      var radioInput = document.createElement('input')
      radioInput.type = 'radio'
      radioInput.id = 'id-' + radioGroup.dataset.questionUuid + '-' + (1 + i)
      radioInput.className = 'govuk-radios__input'
      radioInput.name = 'id-' + radioGroup.dataset.questionUuid
      radioInput.value = option.value

      var label = document.createElement('label')
      label.className = 'govuk-label govuk-radios__label'
      label.innerHTML = option.text
      label.setAttribute('for', 'id-' + radioGroup.dataset.questionUuid + '-' + (1 + i))

      radioItem.appendChild(radioInput)
      radioItem.appendChild(label)

      radioGroup.appendChild(radioItem)
    }
  }

  function selectFirstRadio(radioGroup) {
    var firstRadio = radioGroup.querySelector('input')
    if (firstRadio) {
      radioGroup.value = firstRadio.value
      firstRadio.checked = true
    }
  }

  function updateOptions(element, options) {
    removeExistingOptions(element)

    if (isRadio(element)) {
      return createRadioOptions(element, options)
    }
    if (isDropdown(element)) {
      return createDropdownOptions(element, options)
    }
    return
  }

  function fetchReferenceData(state, element, callback) {
    if (targetHasValues(state)) {
      var req = new XMLHttpRequest()
      req.open('POST', '/' + assessmentUuid + '/episode/' + episodeUuid + '/referencedata/filtered')
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      req.send(JSON.stringify(state))

      req.onload = function() {
        if (this.status !== 200) {
          return removeExistingOptions(element)
        }
        updateOptions(element, JSON.parse(this.responseText))
      }

      req.onerror = function() {
        removeExistingOptions(element)
      }
    }
  }

  function addListenerToTarget(targetElement, element, state) {
    var questionUuid = targetElement.dataset.questionUuid
    targetElement.addEventListener('change', function(event) {
      state.targetValues[questionUuid] = event.target.value

      fetchReferenceData(state, element)
    })
  }

  for (var i = 0; i < dynamicElements.length; i++) {
    var element = dynamicElements[i]
    var questionUuid = element.dataset.questionUuid
    var targets = JSON.parse(element.dataset.referenceDataTargets)

    state[questionUuid] = { questionUuid: questionUuid, targetValues: {}, requiredValues: {} }

    for (var j = 0; j < targets.length; j++) {
      var target = targets[j]

      if (target.uuid === questionUuid) {
        continue
      }

      state[questionUuid].targetValues[target.uuid] = null
      state[questionUuid].requiredValues[target.uuid] = target.isRequired

      var targetElements = document.querySelectorAll('[data-question-uuid="' + target.uuid + '"]')

      for (var k = 0; k < targetElements.length; k++) {
        var targetElement = targetElements[k]
        var targetElementUuid = targetElement.dataset.questionUuid

        if (isRadio(targetElement)) {
          selectFirstRadio(targetElement)
        }

        state[questionUuid].targetValues[targetElementUuid] = targetElement.value
        addListenerToTarget(targetElement, element, state[questionUuid])
      }
    }

    fetchReferenceData(state[questionUuid], element)
  }
}
