const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? rubles.format(amount) : '—';
}

export function formatWarehouseCount(count) {
  const remainder100 = count % 100;
  const remainder10 = count % 10;

  if (remainder100 >= 11 && remainder100 <= 14) return `${count} складов`;
  if (remainder10 === 1) return `${count} склад`;
  if (remainder10 >= 2 && remainder10 <= 4) return `${count} склада`;
  return `${count} складов`;
}
