// /* global io */
(() => {
  // const socket = io()
  const apiPrefix = '/api/v1/windowsSwitch'

  const turnOnButton = document.querySelector('#laptop_trigger')
  const loading = document.querySelector('#laptop_loading')

  turnOnButton.addEventListener('click', () => {
    turnOnButton.classList.add('hidden')
    loading.classList.remove('hidden')
    fetch(`${apiPrefix}/toggle`, {
      method: 'POST'
    })
      .then((response) => {
        turnOnButton.classList.remove('hidden')
        loading.classList.add('hidden')
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
