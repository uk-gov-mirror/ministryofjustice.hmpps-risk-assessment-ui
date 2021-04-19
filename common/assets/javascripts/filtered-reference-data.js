/* eslint-disable */
function addFilteredReferenceDataListeners(assessmentUuid, episodeUuid) {
  var state = {}
  var elementsWithTargets = document.querySelectorAll('[data-reference-data-target]')

  function targetHasValues(state) {
    var keys = Object.keys(state)
    for (var i = 0; i < keys.length; i++) {
      if (state[keys[i]] === null) {
        return false
      }
    }
    return true
  }

  function clearOptions(multipleChoiceElement) {
    while (multipleChoiceElement.options.length > 0) {
      multipleChoiceElement.remove(0)
    }
  }

  function updateOptions(multipleChoiceElement, newOptions) {
    clearOptions(multipleChoiceElement)

    for (var i = 0; i < newOptions.length; i++) {
      var option = newOptions[i]

      var optionElement = document.createElement('option')
      optionElement.text = option.text
      optionElement.value = option.value

      multipleChoiceElement.add(optionElement)
    }
  }

  function fetchReferenceData(state, multipleChoiceElement, callback) {
    if (targetHasValues(state)) {
      var req = new XMLHttpRequest()
      req.open('POST', '/' + assessmentUuid + '/episode/' + episodeUuid + '/referencedata/filtered')
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      req.send(JSON.stringify(state))

      req.onload = function() {
        if (this.status !== 200) {
          return clearOptions(multipleChoiceElement)
        }
        callback(JSON.parse(this.responseText))
      }

      req.onerror = function() {
        clearOptions(multipleChoiceElement)
      }
    }
  }

  function addListenerToTarget(questionUuid, multipleChoiceElement, state) {
    target.addEventListener('change', function(event) {
      state.targetValues[questionUuid] = event.target.value

      fetchReferenceData(state, multipleChoiceElement, function(newOptions) {
        updateOptions(multipleChoiceElement, newOptions)
      })
    })
  }

  for (var i = 0; i < elementsWithTargets.length; i++) {
    var element = elementsWithTargets[i]
    var questionUuid = element.dataset.questionUuid
    var targetId = element.dataset.referenceDataTarget

    state[questionUuid] = { questionUuid: questionUuid, targetValues: {} }
    state[questionUuid].targetValues[targetId] = null

    var targets = document.querySelectorAll('[data-question-uuid="' + targetId + '"]')

    for (var j = 0; j < targets.length; j++) {
      var target = targets[j]
      var targetId = target.dataset.questionUuid

      state[questionUuid].targetValues[targetId] = target.value
      fetchReferenceData(state[questionUuid], element, function(newOptions) {
        updateOptions(element, newOptions)
      })
      addListenerToTarget(targetId, element, state[questionUuid])
    }
  }
}
