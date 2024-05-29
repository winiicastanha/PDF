import express from 'express';
import { routes } from './routes';

  const app = express();

app.use(routes);

app.listen(3300, () => console.log("Server is running on PORT 3300"));