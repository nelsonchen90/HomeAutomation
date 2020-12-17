import { exec } from 'child_process';

const usbSwitch = (value, cb) => {
  const powerOn = value === true ? 1 : 0;
  console.log(`turning power flag to: ${value}`);
  const execCB = (err, stdout, stderr) => {
    if (cb && typeof cb === 'function') {
      cb(stdout, stderr, err);
    }
  };
  if (value === 'status') {
    exec(`uhubctl`, execCB);
    return;
  }
  exec(`uhubctl -l 1-1 -p 2 -a ${powerOn}`, execCB);
};

export default usbSwitch;