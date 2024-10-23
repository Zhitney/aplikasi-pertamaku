import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

const app = express();
app.use(express.json())


const allowedOrigins = [
  'http://20.211.46.113/ligat',
  'http://20.211.46.113',
  'http://20.211.46.113:80'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));

const connection = new sqlite3.Database('./db/aplikasi.db');

app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const params = [req.params.id];

  connection.all(query, params, (error, results) => {
    if (error) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/user/:id/change-email', csrfProtection, (req, res) => {
  const newEmail = req.body.email;
  const query = 'UPDATE users SET email = ? WHERE id = ?';
  const params = [newEmail, req.params.id];

  connection.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) res.status(404).send('User not found');
    else res.status(200).send('Email updated successfully');
  });
})

app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let fileName = req.query.name;

  // Validasi untuk menghindari path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(fileName)) {
    return res.status(400).send('Invalid file name');
  }

  const filePath = path.join(__dirname, 'files', fileName);
  const normalizedPath = path.normalize(filePath);

  if (!normalizedPath.startsWith(path.join(__dirname, 'files'))) {
    return res.status(403).send('Access denied');
  }

  res.sendFile(normalizedPath);
});

// Melayani index.html untuk semua rute lain
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
