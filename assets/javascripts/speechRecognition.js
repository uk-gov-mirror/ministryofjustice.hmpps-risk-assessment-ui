if ('webkitSpeechRecognition' in window) {
  // Initialize webkitSpeechRecognition
  // eslint-disable-next-line new-cap
  const speechRecognition = new window.webkitSpeechRecognition()

  // String for the Final Transcript
  let finalTranscript = ''

  // Set the properties for the Speech Recognition object
  speechRecognition.continuous = true
  speechRecognition.interimResults = true
  speechRecognition.lang = document.querySelector('#select_dialect').value

  // Callback Function for the onStart Event
  speechRecognition.onstart = () => {
    // Show the Status Element
    document.querySelector('#status').style.display = 'block'
  }
  speechRecognition.onerror = () => {
    // Hide the Status Element
    document.querySelector('#status').style.display = 'none'
  }
  speechRecognition.onend = () => {
    // Hide the Status Element
    document.querySelector('#status').style.display = 'none'
  }

  speechRecognition.onresult = (event) => {
    // Create the interim transcript string locally because we don't want it to persist like final transcript
    let interimTranscript = ''

    // Loop through the results from the speech recognition object.
    for (let i = event.resultIndex; i < event.results.length; i++) {
      // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interimTranscript += event.results[i][0].transcript
      }
    }

    // Set the Final transcript and Interim transcript.
    document.querySelector('#additional_information').innerHTML = finalTranscript
    document.querySelector('#interim').innerHTML = interimTranscript
  }

  // Set the onClick property of the start button
  document.querySelector('#start').onclick = (e) => {
    e.preventDefault()
    // Start the Speech Recognition
    speechRecognition.start()
  }
  // Set the onClick property of the stop button
  document.querySelector('#stop').onclick = (e) => {
    e.preventDefault()
    // Stop the Speech Recognition
    speechRecognition.stop()
  }
}
