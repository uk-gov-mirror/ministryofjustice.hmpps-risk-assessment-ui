const featureToHide = document.querySelector('#hideFeature')

if (featureToHide) {
  featureToHide.ondblclick = function hideFeature(e) {
    e.preventDefault()
    document.querySelector('#hideFeature').style.display = 'none'
  }
}
