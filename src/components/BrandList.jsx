import { ChevronRight } from 'lucide-react';
import { getStockSummary } from '../utils/offers';
import { EmptyState, ErrorState, Loader } from './FeedbackStates';

export default function BrandList({ brands, status, error, selectedBrand, onSelect, onRetry }) {
  return (
    <aside className="brands-column" aria-labelledby="brands-heading">
      <div className="section-heading">
        <div><span className="section-kicker">Шаг 1</span><h2 id="brands-heading">Производители</h2></div>
        <span className="count-badge">{status === 'succeeded' ? brands.length : '—'}</span>
      </div>
      <ul className="brand-list" aria-label="Список производителей">
        {status === 'loading' && <li className="brand-list-state"><Loader label="Ищем производителей…" /></li>}
        {status === 'failed' && <li className="brand-list-state"><ErrorState text={error} retry={onRetry} /></li>}
        {status === 'succeeded' && brands.length === 0 && (
          <li className="brand-list-state">
            <EmptyState title="Ничего не найдено" text="Проверьте артикул и попробуйте поискать ещё раз." />
          </li>
        )}
        {status === 'succeeded' && brands.map((item, index) => {
          const { stock } = getStockSummary(item);
          const isSelected = selectedBrand === item.brand;

          return (
            <li className="brand-list-item" key={`${item.brand}-${item.goodsID || index}`}>
              <button
                className={`brand-option ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(item.brand)}
                aria-pressed={isSelected}
              >
                <span className="brand-initial" aria-hidden="true">{item.brand?.slice(0, 1).toUpperCase()}</span>
                <span className="brand-details">
                  <strong>{item.brand}</strong>
                  <small>{item.number}{item.name ? ` · ${item.name}` : ''}</small>
                </span>
                <span className="brand-meta">
                  {stock > 0
                    ? <><b>{stock}</b><small>шт.</small></>
                    : <small className="muted">под заказ</small>}
                  <ChevronRight size={15} aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
