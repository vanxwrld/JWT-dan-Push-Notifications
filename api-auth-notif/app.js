import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import notificationRoutes from './routes/notifications.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ pesan: 'API Auth & Notification berjalan' });
});

app.use('/auth', authRoutes);
app.use('/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ pesan: 'endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status === 400 ? 400 : 500;
  res.status(status).json({
    pesan: status === 400 ? 'body request tidak valid' : 'terjadi kesalahan server',
  });
});

export default app;