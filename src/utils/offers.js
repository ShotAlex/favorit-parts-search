export function getStockSummary(good) {
  const warehouses = Array.isArray(good?.warehouses) ? good.warehouses : [];
  const availableWarehouses = warehouses.filter(warehouse => Number(warehouse?.stock) > 0);
  const stock = availableWarehouses.length
    ? availableWarehouses.reduce((total, warehouse) => total + Number(warehouse.stock || 0), 0)
    : Number(good?.count || 0);
  const prices = availableWarehouses
    .map(warehouse => Number(warehouse.price))
    .filter(price => Number.isFinite(price) && price > 0);

  return {
    stock,
    warehouseCount: availableWarehouses.length,
    lowestPrice: prices.length ? Math.min(...prices) : null,
  };
}

export function getOfferRows(goods = []) {
  const rows = goods.flatMap(item => {
    if (!item || (!item.brand && !item.number && !item.name)) return [];

    return [
      { ...item, isRequestedPart: true },
      ...(Array.isArray(item.analogues)
        ? item.analogues.map(analogue => ({ ...analogue, isRequestedPart: false }))
        : []),
    ];
  });

  const seen = new Set();
  return rows.filter(row => {
    const key = `${row.brand}|${row.number}|${row.goodsID}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getAvailableWarehouses(good) {
  return (Array.isArray(good?.warehouses) ? good.warehouses : [])
    .filter(warehouse => Number(warehouse?.stock) > 0);
}
