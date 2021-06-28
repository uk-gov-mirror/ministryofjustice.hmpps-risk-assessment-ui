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

window.GOVUKFrontend.syncConditionals = function($nodeList) {
  nodeListForEach($nodeList, function($currentNode) {
    var $elementsToToggle = $currentNode.getAttribute('data-conditional')
    if ($elementsToToggle) {
      var inputIsChecked = $currentNode.checked
      var $elementArray = $elementsToToggle.split(' ')
      $elementArray.forEach(function($element) {
        var $target = document.querySelector('#conditional-id-form-' + $element)
        if ($target) {
          $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked)
        }
      })

      $currentNode.setAttribute('aria-expanded', inputIsChecked)
    }
  })
}

window.GOVUKFrontend.Radios.handleConditionalRadioClick = function(event) {
  var $clickedInput = event.target
  var $radioGroup = $clickedInput.closest('.govuk-radios').querySelectorAll('input[type="radio"]')

  window.GOVUKFrontend.syncConditionals($radioGroup)
}

window.outOflineConditionalRadios = function() {
  var $questionsWithConditionals = document.querySelectorAll('[data-contains-conditional]')

  nodeListForEach($questionsWithConditionals, function($question) {
    var $radios = $question.querySelectorAll('input[type="radio"]')
    nodeListForEach($radios, function($radio) {
      $radio.addEventListener('click', window.GOVUKFrontend.Radios.handleConditionalRadioClick.bind(this))
    })
  })

  // add id to outofline conditional questions
  var $outofline = document.querySelectorAll('[data-outofline]')
  nodeListForEach($outofline, function($outoflineConditional) {
    var baseId = $outoflineConditional.getAttribute('data-base-id')
    var questionFormGroup = $outoflineConditional.closest('.govuk-radios__conditional--no-indent')
    if (questionFormGroup) {
      questionFormGroup.setAttribute('id', 'conditional-id-form-' + baseId)
    }
  })
}

window.syncAllOutOflineConditionalRadios = function() {
  var $questionsWithConditionals = document.querySelectorAll('[data-contains-conditional]')
  nodeListForEach($questionsWithConditionals, function($question) {
    var $radios = $question.querySelectorAll('input[type="radio"]')
    window.GOVUKFrontend.syncConditionals($radios)
  })
}

window.addEventListener('load', event => {
  syncAllOutOflineConditionalRadios()
})
