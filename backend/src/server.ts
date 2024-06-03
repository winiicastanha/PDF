import express from 'express';
import { routes } from './routes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';


const app = express();
const port = 3001;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  const email = 'admin@example.com';
  const password = bcrypt.hashSync('adminpassword', 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
});

// Define the User interface
interface User {
  id: number;
  email: string;
  password: string;
}

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ error: 'O usuário já existe' });
    }
    res.status(201).json({ message: 'Usuário criado com sucesso' });
    console.log('Usuário criado com sucesso', email, password);
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get<User>('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Email ou senha inválidos!' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos!' });
    }

    //Definindo o expire time do token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
