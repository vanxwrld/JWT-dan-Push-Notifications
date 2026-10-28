import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';

const router = Router();
const DUMMY_HASH = await bcrypt.hash('dummy-password', 12);

router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  if (
    typeof nama !== 'string' || typeof email !== 'string' || typeof password !== 'string' ||
    !nama.trim() || !email.trim() || !password
  ) {
    return res.status(400).json({ pesan: 'nama, email, dan password wajib diisi' });
  }

  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ pesan: 'password harus 8-72 karakter' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ pesan: 'format email tidak valid' });
  }

  const emailBersih = email.trim().toLowerCase();

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const [hasil] = await pool.query(
      `INSERT INTO users (nama, email, password_hash)
       VALUES (?, ?, ?)`,
      [nama.trim(), emailBersih, passwordHash]
    );

    return res.status(201).json({
      id: hasil.insertId,
      nama: nama.trim(),
      email: emailBersih,
    });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ pesan: 'email sudah terdaftar' });
    }
    console.error(e);
    return res.status(500).json({ pesan: 'gagal membuat akun' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ pesan: 'email dan password wajib diisi' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    );

    const user = rows[0];
    const cocok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

    if (!user || !cocok) {
      return res.status(401).json({ pesan: 'email atau password salah' });
    }

    const token = jwt.sign(
      { email: user.email, nama: user.nama },
      process.env.JWT_SECRET,
      {
        subject: String(user.id),
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        issuer: 'pemrograman-mobile-api',
        audience: 'mobile-app',
        algorithm: 'HS256',
      }
    );

    return res.json({
      token,
      user: { id: user.id, nama: user.nama, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ pesan: 'gagal login' });
  }
});

router.get('/me', wajibLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama, email, dibuat_pada FROM users WHERE id = ?',
      [req.user.sub]
    );

    if (rows.length === 0) {
      return res.status(404).json({ pesan: 'pengguna tidak ditemukan' });
    }

    return res.json(rows[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ pesan: 'gagal mengambil profil' });
  }
});

export default router;