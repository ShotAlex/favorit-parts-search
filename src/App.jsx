import { useCallback, useEffect, useRef } from 'react';
import { CircleHelp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from './components/AppHeader';
import IntroSection from './components/IntroSection';
import ResultsSection from './components/ResultsSection';
import SearchPanel from './components/SearchPanel';
import { resetSearch, searchBrands, searchOffers, setNumber } from './store/searchSlice';

const SEARCH_DEBOUNCE_MS = 350;

export default function App() {
  const dispatch = useDispatch();
  const search = useSelector(state => state.search);
  const debounceTimer = useRef(null);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  const searchByNumber = useCallback(number => {
    const cleanNumber = number.trim();
    if (cleanNumber) dispatch(searchBrands(cleanNumber));
  }, [dispatch]);

  const handleNumberChange = useCallback(value => {
    clearTimeout(debounceTimer.current);
    dispatch(setNumber(value));

    if (!value.trim()) {
      dispatch(resetSearch());
      return;
    }

    debounceTimer.current = setTimeout(
      () => searchByNumber(value),
      SEARCH_DEBOUNCE_MS,
    );
  }, [dispatch, searchByNumber]);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    clearTimeout(debounceTimer.current);
    searchByNumber(search.number);
  }, [search.number, searchByNumber]);

  const handleBrandSelect = useCallback(brand => {
    if (!search.number.trim()) return;
    if (brand === search.selectedBrand && search.offersStatus !== 'failed') return;

    dispatch(searchOffers({ number: search.number.trim(), brand }));
    window.setTimeout(() => {
      document.querySelector('.offers-column')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, [dispatch, search.number, search.offersStatus, search.selectedBrand]);

  const retryBrands = useCallback(() => searchByNumber(search.number), [search.number, searchByNumber]);
  const retryOffers = useCallback(() => {
    if (search.selectedBrand) {
      dispatch(searchOffers({ number: search.number.trim(), brand: search.selectedBrand }));
    }
  }, [dispatch, search.number, search.selectedBrand]);

  const currentStep = !search.hasSearched
    ? 1
    : search.selectedBrand || search.offersStatus === 'loading' ? 2 : 1;

  return (
    <div className="app-shell">
      <AppHeader />
      <main id="top" className="main-layout">
        <IntroSection />
        <SearchPanel
          number={search.number}
          currentStep={currentStep}
          isLoading={search.brandsStatus === 'loading'}
          onChange={handleNumberChange}
          onSubmit={handleSubmit}
        />
        <ResultsSection
          search={search}
          onSelectBrand={handleBrandSelect}
          onRetryBrands={retryBrands}
          onRetryOffers={retryOffers}
        />
        <footer className="page-footer">
          <span>Данные предоставлены сервисом Favorit Parts</span>
          <span><CircleHelp size={14} /> Цены и остатки обновляются при каждом запросе</span>
        </footer>
      </main>
    </div>
  );
}
