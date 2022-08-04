const backLink = document.getElementById('back-link')

// Use history.back() to avoid being caught in a loop when repeatedly clicking the link
function goBack(e) {
  e.preventDefault()
  window.history.back()
  return false
}

backLink.addEventListener('click', goBack)
