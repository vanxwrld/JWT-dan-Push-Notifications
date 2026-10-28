const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
    const err = new Error('Tidak dapat terhubung ke server. Periksa jaringan dan alamat API.');
    err.status = 0;
    throw err;
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.pesan || `Request gagal (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return data;
}