import { apiFetch } from './api';

export function registerUser(nama, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nama, email, password }),
  });
}

export function loginUser(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token) {
  return apiFetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}