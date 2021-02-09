// @formatter:off
window.GOVUKFrontend = require('govuk-frontend')

window.initAll = window.GOVUKFrontend.initAll
window.accessibleAutocomplete = require('accessible-autocomplete')

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (let i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

window.GOVUKFrontend.Radios.handleConditionalRadioClick = function(event) {
  var $clickedInput = event.target
  var $radioGroup = $clickedInput.closest('.govuk-radios').querySelectorAll('input[type="radio"]')

  nodeListForEach($radioGroup, function($radio) {
    var $elementToToggle = $radio.getAttribute('data-conditional')
    if ($elementToToggle) {
      var inputIsChecked = $radio.checked
      var $target = document.querySelector('#conditional-id-form-' + $elementToToggle)
      $radio.setAttribute('aria-expanded', inputIsChecked)
      $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
    }
  })
}

window.outOflineConditionalRadios = function() {
  var questionsWithConditionals = document.querySelector('[data-contains-conditional]')
  if (questionsWithConditionals) {
    var $radios = questionsWithConditionals.querySelectorAll('input[type="radio"]')
    nodeListForEach($radios, function($radio) {
      $radio.addEventListener('click', window.GOVUKFrontend.Radios.handleConditionalRadioClick.bind(this))
    })
  }

  // add id to outofline conditional questions
  var $outofline = document.querySelectorAll('[data-outofline]')
  nodeListForEach($outofline, function($outoflineConditional) {
    var baseId = $outoflineConditional.getAttribute('data-base-id')
    var questionFormGroup = $outoflineConditional.closest('.govuk-radios__conditional--noIndent')
    questionFormGroup.setAttribute('id', 'conditional-id-form-' + baseId)
  })
}
