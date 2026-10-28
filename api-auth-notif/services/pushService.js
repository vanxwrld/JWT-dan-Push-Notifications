const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export async function kirimExpoPush(tokens, pesan) {
  const daftar = Array.isArray(tokens) ? tokens : [tokens];

  const messages = daftar.map((to) => ({
    to,
    sound: 'default',
    channelId: 'default',
    title: pesan.title,
    body: pesan.body,
    data: pesan.data || {},
  }));

  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error('Gagal mengirim ke Expo Push Service');
  }

  return result.data.map((ticket, i) => ({ token: daftar[i], ...ticket }));
}