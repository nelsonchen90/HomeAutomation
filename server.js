import express from'express';
import mainRoute from './routes/mainRoute.js';

const app = express();
const host = '0.0.0.0';
const port = 3000;

app.use('/', mainRoute);

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`)
});