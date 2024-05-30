import express from 'express';
import { routes } from './routes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

const app = express();

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados URL-encoded (formulários)
app.use(express.urlencoded({ extended: true }));

app.use(routes);
dotenv.config();

app.listen(3300, () => console.log("Server is running on PORT 3300"));