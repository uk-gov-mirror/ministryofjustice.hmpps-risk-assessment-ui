// @formatter:off
const { initAll, Radios } = require('govuk-frontend')

window.initAll = initAll
window.accessibleAutocomplete = require('accessible-autocomplete')

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (let i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

window.syncConditionals = function ($nodeList) {
  nodeListForEach($nodeList, function ($currentNode) {
    var $elementsToToggle = $currentNode.getAttribute('data-conditional')
    if ($elementsToToggle) {
      var inputIsChecked = $currentNode.checked
      var $elementArray = $elementsToToggle.split(' ')
      $elementArray.forEach(function ($element) {
        var $target = document.querySelector('#conditional-id-form-' + $element)
        if ($target) {
          $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
        }
      })

      $currentNode.setAttribute('aria-expanded', inputIsChecked)
    }
  })
}

Radios.handleConditionalRadioClick = function (event) {
  var $clickedInput = event.target
  var $radioGroup = $clickedInput.closest('.govuk-radios').querySelectorAll('input[type="radio"]')

  window.syncConditionals($radioGroup)
}

window.outOfLineConditionalRadios = function () {
  var $questionsWithConditionals = document.querySelectorAll('[data-contains-conditional]')

  nodeListForEach($questionsWithConditionals, function ($question) {
    var $radios = $question.querySelectorAll('input[type="radio"]')
    nodeListForEach($radios, function ($radio) {
      $radio.addEventListener('click', Radios.handleConditionalRadioClick.bind(this))
    })
  })

  // add id to out of line conditional questions
  var $outOfLine = document.querySelectorAll('[data-outOfLine]')
  nodeListForEach($outOfLine, function ($outOfLineConditional) {
    var baseId = $outOfLineConditional.getAttribute('data-base-question-code')
    var questionFormGroup = $outOfLineConditional.closest('.govuk-radios__conditional--no-indent')
    if (questionFormGroup) {
      questionFormGroup.setAttribute('id', 'conditional-id-form-' + baseId)
    }
  })
}

window.syncAllOutOfLineConditionalRadios = function () {
  var $questionsWithConditionals = document.querySelectorAll('[data-contains-conditional]')
  nodeListForEach($questionsWithConditionals, function ($question) {
    var $radios = $question.querySelectorAll('input[type="radio"]')
    window.syncConditionals($radios)
  })
}

window.addEventListener('load', (event) => {
  syncAllOutOfLineConditionalRadios()
})
