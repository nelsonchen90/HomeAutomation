(() => {
  const loginForm = document.querySelector('#login_form')

  const addOrUpdateWarning = (formEle, msg) => {
    const result = formEle.querySelector('#warning')
    const warningEle = result || document.createElement('p')
    try {
      formEle.removeChild(warningEle)
    } catch (e) {
      warningEle.id = 'warning'
      warningEle.style.color = 'red'
    }
    warningEle.innerHTML = msg
    formEle.appendChild(warningEle)
    return warningEle
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const FD = new FormData(event.target)
    const username = FD.get('username')
    const password = FD.get('password')
    if (username && password) {
      // sign in
      fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      }).then(async (response) => {
        const json = await response.json()
        if (!response.ok) {
          throw new Error(json.errorMessage)
        } else {
          window.location.href = '/home'
        }
      }).catch((err) => {
        addOrUpdateWarning(event.target, err.message)
      })
    } else {
      addOrUpdateWarning(event.target,
        `Missing fields: ${username.length === 0 && 'User name'}  ${password.length === 0 && 'Password'}`
      )
    }
  })
})()
