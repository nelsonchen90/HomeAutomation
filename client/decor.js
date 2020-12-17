(() => {
  const api_prefix = '/api/v1/usbSwitch';

  const statusElement = document.querySelector("#decor_status");
  const turnOnButton = document.querySelector("#decor_on");
  const turnOffButton = document.querySelector("#decor_off");
  
  const getStatus = () => {
    fetch(`${api_prefix}/status`)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return Promise.reject(response);
        }
      })
      .then((text) => {
        const value = text.includes('0000') ? 'off' : 'on';
        toggleSwitchDisplay(value)
        statusElement.textContent = text;
     });
  };

  const toggleDecorLight = (value) => {
    return fetch(`${api_prefix}/${value}`)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return Promise.reject(response);
        }
      })
      .then((text) => {
        statusElement.textContent = text;
     });
  }
  const toggleSwitchDisplay = (value) => {
    turnOnButton.className = value === 'on' ? 'hidden' : '';
    turnOffButton.className = value === 'off' ? 'hidden' : '';
  }
  const toggleElements = (value) => {
    turnOnButton.setAttribute('disabled', 'true');
    turnOffButton.setAttribute('disabled', 'true');
    toggleDecorLight(value)
      .then(() => {
        toggleSwitchDisplay(value);
        turnOnButton.removeAttribute('disabled');
        turnOffButton.removeAttribute('disabled');
      })
      .catch(() => {
        turnOnButton.setAttribute('disabled', 'true');
        turnOffButton.setAttribute('disabled', 'true');
      });
  }

  getStatus();

  turnOnButton.addEventListener('click', () => {
    toggleElements('on');
  });

  turnOffButton.addEventListener('click', () => {
    toggleElements('off');
  });

})()
