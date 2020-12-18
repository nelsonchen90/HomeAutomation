#!/home/pi/.nvm/versions/node/v15.4.0/bin/node

import express from 'express';
// import helmet from 'helmet';
import mainRoute from './routes/mainRoute.js';

const app = express();
const host = '0.0.0.0';
const isProd = process.env.NODE_ENV === 'production';
const port = isProd ? 3002 : 3000;
const appName = 'Home automation';


// app.use(helmet());
app.set('title', appName);
app.use('/', mainRoute);

const server = app.listen(port, host, () => {
  console.log(`${appName} listening at http://${host}:${port}`)
  console.log('pid is ' + process.pid);
});

const handleExit = (signal) => {
  console.log(`Received ${signal}. Close my server properly.`);
  server.close(function () {
    process.exit(0);
  });
}
process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);