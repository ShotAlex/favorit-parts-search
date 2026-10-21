import { useState } from 'react';
import { ArrowDown, ArrowUp, SlidersHorizontal } from 'lucide-react';
import { formatPrice, formatWarehouseCount } from '../utils/formatters';
import { getAvailableWarehouses, getStockSummary } from '../utils/offers';
import { EmptyState, ErrorState, Loader } from './FeedbackStates';

function WarehouseDetails({ warehouses }) {
  return (
    <div className="warehouse-panel">
      <div className="warehouse-title">Предложения по складам</div>
      {warehouses.length ? warehouses.map((warehouse, index) => (
        <div className="warehouse-item" key={warehouse.id || index}>
          <span className="warehouse-name">
            <span className={warehouse.own ? 'own-dot' : 'partner-dot'} />
            {warehouse.code || `Склад ${index + 1}`}
            {warehouse.own && <small>свой</small>}
          </span>
          <span>{Number(warehouse.stock)} шт.</span>
          <strong>{formatPrice(Number(warehouse.price))}</strong>
        </div>
      )) : <p>Нет доступных складских предложений.</p>}
    </div>
  );
}

function OfferRow({ offer, onToggle, isExpanded }) {
  const stock = getStockSummary(offer);
  const warehouses = getAvailableWarehouses(offer);
  const isRequestedPart = offer.isRequestedPart;

  return (
    <>
      <tr className={isExpanded ? 'row-open' : ''}>
        <td>
          <div className="part-cell">
            <span className={`part-chip ${isRequestedPart ? 'original-chip' : ''}`}>
              {isRequestedPart ? 'Оригинал' : offer.brand || 'Аналог'}
            </span>
            <strong>{offer.name || offer.brand || 'Автозапчасть'}</strong>
            <span className="part-number">{offer.brand} <i>/</i> {offer.number}</span>
          </div>
        </td>
        <td>
          <span className={`stock-pill ${stock.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            <i />{stock.stock > 0 ? `${stock.stock} шт.` : 'Нет в наличии'}
          </span>
          {stock.warehouseCount > 0 && (
            <small className="warehouse-count">{formatWarehouseCount(stock.warehouseCount)}</small>
          )}
        </td>
        <td>
          <strong className="price-value">{stock.lowestPrice ? formatPrice(stock.lowestPrice) : '—'}</strong>
          <small className="price-caption">{stock.lowestPrice ? 'за единицу' : 'уточняется'}</small>
        </td>
        <td>
          <button
            className={`row-toggle ${isExpanded ? 'expanded' : ''}`}
            onClick={onToggle}
            aria-label={isExpanded ? 'Скрыть склады' : 'Показать склады'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="warehouse-row">
          <td colSpan="4"><WarehouseDetails warehouses={warehouses} /></td>
        </tr>
      )}
    </>
  );
}

function OffersTable({ rows }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="offers-table-wrap">
      <table className="offers-table">
        <thead>
          <tr><th>Деталь</th><th>Наличие</th><th>Цена от</th><th aria-label="Подробнее" /></tr>
        </thead>
        <tbody>
          {rows.map((offer, index) => {
            const id = offer.goodsID || `${offer.brand}-${offer.number}-${index}`;
            const isExpanded = expandedId === id;

            return (
              <OfferRow
                key={id}
                offer={offer}
                isExpanded={isExpanded}
                onToggle={() => setExpandedId(isExpanded ? null : id)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function OfferResults({ status, error, rows, selectedBrand, onRetry }) {
  if (!selectedBrand && status !== 'loading') {
    return (
      <EmptyState
        icon={SlidersHorizontal}
        title="Выберите производителя"
        text="После выбора загрузим оригинальную деталь, аналоги и цены по складам."
      />
    );
  }

  if (status === 'loading') {
    return (
      <div className="offer-loading">
        <Loader label="Загружаем аналоги и предложения…" />
        <div className="skeleton-row" /><div className="skeleton-row" /><div className="skeleton-row" />
      </div>
    );
  }

  if (status === 'failed') return <ErrorState text={error} retry={onRetry} />;
  if (status === 'succeeded' && rows.length === 0) {
    return (
      <EmptyState
        title="Предложений пока нет"
        text="По выбранному производителю сервис не вернул детали. Выберите другого производителя."
      />
    );
  }

  if (status === 'succeeded') return <OffersTable rows={rows} />;
  return null;
}
