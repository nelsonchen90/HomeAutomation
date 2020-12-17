import express from 'express';
import USBSwitchRouter from './USBSwitch.js';

const mainRouter = express.Router();

mainRouter.get('/', (req, resp) => {
  resp.contentType('text/html');
  resp.send('Home automation');
});

mainRouter.use('/usbSwitch', USBSwitchRouter);

export default mainRouter;
