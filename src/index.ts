import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello Word' });
});

app.listen(PORT);
