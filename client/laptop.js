// /* global io */
(() => {
  // const socket = io()
  const apiPrefix = '/api/v1/windowsSwitch'

  const turnOnButton = document.querySelector('#laptop_trigger')

  turnOnButton.addEventListener('click', () => {
    console.log('click')
    return fetch(`${apiPrefix}/toggle`, {
      method: 'POST'
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      })
      .then((json) => {
        console.log(json)
      })
  })
})()
