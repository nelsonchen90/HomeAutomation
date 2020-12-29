/* global io */
(() => {
  const socket = io()
  const apiPrefix = '/api/v1/usbSwitch'

  const turnOnButton = document.querySelector('#decor_on')
  const turnOffButton = document.querySelector('#decor_off')
  const loadingAnimation = document.querySelector('#decor_loading')

  const getStatus = () => {
    fetch(`${apiPrefix}/status`)
      .then((response) => {
        if (response.ok) {
          return response.text()
        } else {
          return Promise.reject(response)
        }
      })
      .then((text) => {
        handleToggleResponse(text)
      })
  }

  const handleToggleResponse = (text) => {
    const statusSplit = text.split('New status')
    let nextStatusText = text
    if (statusSplit.length > 1) {
      nextStatusText = statusSplit[1]
    }
    const value = nextStatusText.includes('0000') ? 'off' : 'on'
    toggleSwitchDisplay(value)
  }

  const toggleDecorLight = (value) => {
    return fetch(`${apiPrefix}/${value}`)
      .then((response) => {
        if (response.ok) {
          return response.text()
        } else {
          return Promise.reject(response)
        }
      })
  }
  const toggleSwitchDisplay = (value) => {
    turnOnButton.className = value === 'on' ? 'hidden' : ''
    turnOffButton.className = value === 'off' ? 'hidden' : 'on'
  }
  const toggleElements = (value) => {
    turnOnButton.classList.add('hidden')
    turnOffButton.classList.add('hidden')
    loadingAnimation.classList.remove('hidden')
    toggleDecorLight(value)
      .then(() => {
        toggleSwitchDisplay(value)
        loadingAnimation.classList.add('hidden')
      })
      .catch(() => {
        toggleSwitchDisplay(value === 'on' ? 'off' : 'on')
        loadingAnimation.classList.add('hidden')
      })
  }

  getStatus()

  turnOnButton.addEventListener('click', () => {
    toggleElements('on')
  })

  turnOffButton.addEventListener('click', () => {
    toggleElements('off')
  })

  socket.on('component/usbSwitch', (msg) => {
    handleToggleResponse(msg)
  })
})()
