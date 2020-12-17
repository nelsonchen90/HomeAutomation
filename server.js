import express from 'express';
import helmet from 'helmet';
import mainRoute from './routes/mainRoute.js';

const app = express();
const host = '0.0.0.0';
const port = 3000;
const appName = 'Home automation';

app.use(helmet());
app.set('title', appName);
app.use('/', mainRoute);

app.listen(port, host, () => {
  console.log(`${appName} listening at http://${host}:${port}`)
});