import { ChevronRight } from 'lucide-react';
import { getStockSummary } from '../utils/offers';
import { EmptyState, ErrorState, Loader } from './FeedbackStates';

export default function BrandList({ brands, status, error, selectedBrand, onSelect, onRetry }) {
  return (
    <aside className="brands-column">
      <div className="section-heading">
        <div><span className="section-kicker">Шаг 1</span><h2>Производители</h2></div>
        <span className="count-badge">{status === 'succeeded' ? brands.length : '—'}</span>
      </div>
      <div className="brand-list">
        {status === 'loading' && <Loader label="Ищем производителей…" />}
        {status === 'failed' && <ErrorState text={error} retry={onRetry} />}
        {status === 'succeeded' && brands.length === 0 && (
          <EmptyState title="Ничего не найдено" text="Проверьте артикул и попробуйте поискать ещё раз." />
        )}
        {status === 'succeeded' && brands.map((item, index) => {
          const { stock } = getStockSummary(item);
          const isSelected = selectedBrand === item.brand;

          return (
            <button
              className={`brand-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(item.brand)}
              key={`${item.brand}-${item.goodsID || index}`}
            >
              <span className="brand-initial">{item.brand?.slice(0, 1).toUpperCase()}</span>
              <span className="brand-details">
                <strong>{item.brand}</strong>
                <small>{item.number}{item.name ? ` · ${item.name}` : ''}</small>
              </span>
              <span className="brand-meta">
                {stock > 0
                  ? <><b>{stock}</b><small>шт.</small></>
                  : <small className="muted">под заказ</small>}
                <ChevronRight size={15} />
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
