import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

const app = express();
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csrfProtection = csrf({ cookie: true });

app.use(express.json());


const allowedOrigins = [
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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const connection = new sqlite3.Database('./db/aplikasi.db');

// GET API untuk user
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const params = [req.params.id];

  connection.all(query, params, (error, results) => {
    if (error) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// POST API untuk mengubah email dengan CSRF protection
app.post('/api/user/:id/change-email', csrfProtection, (req, res) => {
  const newEmail = req.body.email;
  const query = 'UPDATE users SET email = ? WHERE id = ?';
  const params = [newEmail, req.params.id];

  connection.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) res.status(404).send('User not found');
    else res.status(200).send('Email updated successfully');
  });
});

// API untuk mengirim file
app.get('/api/file', (req, res) => {
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
