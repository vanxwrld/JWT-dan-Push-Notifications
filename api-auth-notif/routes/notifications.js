import { Router } from 'express';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';
import { kirimExpoPush } from '../services/pushService.js';

const router = Router();
const FORMAT_TOKEN = /^Expo(nent)?PushToken\[[^\]]+\]$/;

router.post('/token', wajibLogin, async (req, res) => {
  const { expoPushToken } = req.body;

  if (typeof expoPushToken !== 'string' || !FORMAT_TOKEN.test(expoPushToken)) {
    return res.status(400).json({ pesan: 'push token tidak valid' });
  }

  try {
    await pool.query(
      `INSERT INTO push_tokens (user_id, expo_push_token)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
         user_id = VALUES(user_id),
         diperbarui_pada = CURRENT_TIMESTAMP`,
      [req.user.sub, expoPushToken]
    );
    return res.status(201).json({ pesan: 'push token tersimpan' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ pesan: 'gagal menyimpan push token' });
  }
});

router.delete('/token', wajibLogin, async (req, res) => {
  const { expoPushToken } = req.body;

  if (typeof expoPushToken !== 'string') {
    return res.status(400).json({ pesan: 'push token tidak valid' });
  }

  try {
    await pool.query(
      'DELETE FROM push_tokens WHERE user_id = ? AND expo_push_token = ?',
      [req.user.sub, expoPushToken]
    );
    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ pesan: 'gagal menghapus push token' });
  }
});

router.post('/test', wajibLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT expo_push_token
       FROM push_tokens
       WHERE user_id = ?
       ORDER BY diperbarui_pada DESC`,
      [req.user.sub]
    );

    if (rows.length === 0) {
      return res.status(404).json({ pesan: 'perangkat belum mendaftarkan push token' });
    }

    const tiket = await kirimExpoPush(rows.map((r) => r.expo_push_token), {
      title: 'Praktikum Pemrograman Mobile',
      body: 'Login JWT dan push notification berhasil.',
      data: { screen: 'profile' },
    });

    const mati = tiket
      .filter((t) => t.status === 'error' && t.details?.error === 'DeviceNotRegistered')
      .map((t) => t.token);

    if (mati.length > 0) {
      await pool.query('DELETE FROM push_tokens WHERE expo_push_token IN (?)', [mati]);
    }

    return res.json({
      pesan: 'notifikasi dikirim',
      hasil: tiket.map(({ token, ...sisa }) => sisa),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ pesan: 'gagal mengirim notifikasi' });
  }
});

export default router;