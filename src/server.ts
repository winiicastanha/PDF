import express from 'express';
import { routes } from './routes';
import dotenv from 'dotenv';

  const app = express();

app.use(routes);
dotenv.config();

app.listen(3300, () => console.log("Server is running on PORT 3300"));