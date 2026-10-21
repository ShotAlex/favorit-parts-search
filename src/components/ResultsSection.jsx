import { useMemo } from 'react';
import { getOfferRows } from '../utils/offers';
import BrandList from './BrandList';
import OfferResults from './OfferResults';
import WelcomePanel from './WelcomePanel';

export default function ResultsSection({ search, onSelectBrand, onRetryBrands, onRetryOffers }) {
  const rows = useMemo(() => getOfferRows(search.offers), [search.offers]);

  return (
    <section className="results-section" aria-label="Результаты подбора">
      {!search.hasSearched ? (
        <WelcomePanel />
      ) : (
        <div className="results-grid">
          <BrandList
            brands={search.brands}
            status={search.brandsStatus}
            error={search.brandsError}
            selectedBrand={search.selectedBrand}
            onSelect={onSelectBrand}
            onRetry={onRetryBrands}
          />
          <div className="offers-column">
            <div className="section-heading offers-heading">
              <div>
                <span className="section-kicker">Шаг 2</span>
                <h2>{search.selectedBrand ? `Предложения ${search.selectedBrand}` : 'Аналоги и предложения'}</h2>
              </div>
              {search.selectedBrand && search.offersStatus === 'succeeded' && (
                <span className="count-badge">{rows.length}</span>
              )}
            </div>
            <OfferResults
              status={search.offersStatus}
              error={search.offersError}
              rows={rows}
              selectedBrand={search.selectedBrand}
              onRetry={onRetryOffers}
            />
          </div>
        </div>
      )}
    </section>
  );
}
