import { apiFetch } from './api';

export function simpanPushToken(token, expoPushToken) {
  return apiFetch('/notifications/token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ expoPushToken }),
  });
}

export function hapusPushToken(token, expoPushToken) {
  return apiFetch('/notifications/token', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ expoPushToken }),
  });
}

export function kirimNotifikasiUji(token) {
  return apiFetch('/notifications/test', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}