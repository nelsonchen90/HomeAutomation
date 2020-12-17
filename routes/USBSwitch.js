import express from 'express';
import usbSwitch from '../utils/usbSwitch.js';

const USBSwitchRouter = express.Router();

USBSwitchRouter.get('/:value', (req, resp, next) => {
  console.log('get usb switch');
  next();
});

USBSwitchRouter.param('value', (req, resp, next, value) => {
  const powerFlag = value === 'on' ? true : false;
  usbSwitch(powerFlag, (stdout, stderr, error) => {
    if (error) {
      resp.send(`Error: <br/> ${error}`);
      resp.statusCode = 500;
    } else {
      resp.send(`Turned on USB: <br/> <pre>${stdout}</pre>`);
      resp.statusCode = 200;
    }
  });
});


export default USBSwitchRouter;