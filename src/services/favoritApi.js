const API_URL = import.meta.env.VITE_API_URL || 'https://api.favorit-parts.ru/hs/hsprice/';
const DEMO_KEY = '00000000-0000-0000-0000-000000000001';

export async function fetchGoods({ number, brand }) {
  const url = new URL(API_URL);
  url.searchParams.set('key', import.meta.env.VITE_FAVORIT_API_KEY || DEMO_KEY);
  url.searchParams.set('number', number);
  url.searchParams.set('info', 'on');

  if (brand) {
    url.searchParams.set('brand', brand);
    url.searchParams.set('analogues', 'on');
  }

  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch {
    throw new Error('Не удалось связаться с сервисом. Проверьте подключение и попробуйте ещё раз.');
  }

  if (!response.ok) {
    throw new Error(`Сервис ответил с ошибкой (${response.status}). Попробуйте позже.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Сервис вернул некорректный ответ. Попробуйте позже.');
  }

  if (data.error) {
    throw new Error(Array.isArray(data.error) ? data.error.join(', ') : String(data.error));
  }

  return Array.isArray(data.goods) ? data.goods : [];
}
