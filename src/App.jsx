import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDown, ArrowUpRight, Check, ChevronRight, CircleHelp, PackageSearch, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Sparkles, Truck } from 'lucide-react';
import { resetSearch, searchBrands, searchOffers, setNumber } from './store/searchSlice';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const fmt = value => Number.isFinite(Number(value)) ? money.format(Number(value)) : '—';

function IconMark() {
  return <div className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></div>;
}

function Loader({ label }) {
  return <div className="inline-state"><span className="spinner" />{label}</div>;
}

function EmptyState({ icon: Icon = PackageSearch, title, text, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

function ErrorState({ text, retry }) {
  return <div className="error-state"><div><strong>Не получилось загрузить данные</strong><p>{text}</p></div>{retry && <button className="button button-light" onClick={retry}><RotateCcw size={15} /> Повторить</button>}</div>;
}

function stockInfo(good) {
  const warehouses = Array.isArray(good?.warehouses) ? good.warehouses : [];
  const inStock = warehouses.filter(w => Number(w?.stock) > 0);
  const total = inStock.length ? inStock.reduce((sum, w) => sum + Number(w.stock || 0), 0) : Number(good?.count || 0);
  const prices = inStock.map(w => Number(w.price)).filter(n => Number.isFinite(n) && n > 0);
  return { total, warehouses: inStock.length, price: prices.length ? Math.min(...prices) : null };
}

function offerGroups(goods) {
  const rows = [];
  for (const item of goods || []) {
    if (!item || (!item.brand && !item.number && !item.name)) continue;
    const nested = Array.isArray(item.analogues) ? item.analogues : [];
    rows.push({ ...item, isRequested: true });
    for (const analogue of nested) rows.push({ ...analogue, isRequested: false });
  }
  const seen = new Set();
  return rows.filter(row => {
    const key = `${row.brand}|${row.number}|${row.goodsID}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function App() {
  const dispatch = useDispatch();
  const { number, brands, offers, selectedBrand, brandsStatus, offersStatus, brandsError, offersError, hasSearched } = useSelector(s => s.search);
  const [expandedId, setExpandedId] = useState(null);
  const timerRef = useRef(null);
  const resultRef = useRef(null);
  const rows = useMemo(() => offerGroups(offers), [offers]);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  const beginSearch = (value) => {
    const clean = value.trim();
    clearTimeout(timerRef.current);
    dispatch(setNumber(value));
    if (!clean) { dispatch(resetSearch()); return; }
    timerRef.current = setTimeout(() => dispatch(searchBrands(clean)), 350);
  };
  const submit = (event) => {
    event?.preventDefault();
    const clean = number.trim();
    if (!clean) return;
    clearTimeout(timerRef.current);
    dispatch(searchBrands(clean));
  };
  const chooseBrand = (brand) => {
    if (!number.trim() || brand === selectedBrand && offersStatus !== 'failed') return;
    setExpandedId(null);
    dispatch(searchOffers({ number: number.trim(), brand }));
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const currentStep = !hasSearched ? 1 : selectedBrand || offersStatus === 'loading' ? 2 : 1;
  return <div className="app-shell">
    <header className="topbar">
      <a className="identity" href="#top" aria-label="Favorit Parts — главная"><IconMark /><span>favorit<span className="identity-light">parts</span></span></a>
      <div className="topbar-right"><span className="api-status"><i /> Сервис доступен</span><span className="topbar-divider"/><span className="portal-label">Подбор по каталогу</span></div>
    </header>

    <main id="top" className="main-layout">
      <section className="intro">
        <div className="intro-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> Каталог автозапчастей</div>
          <h1>Найдите деталь.<br /><span>Подберите аналог.</span></h1>
          <p className="intro-description">Введите артикул — покажем производителей,<br className="desktop-break" /> актуальные цены и наличие на складах.</p>
        </div>
        <div className="intro-art" aria-hidden="true">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="part-disc"><div className="disc-inner"><div className="disc-hub"/><i/><i/><i/><i/><i/><i/></div></div>
          <div className="art-caption"><span>Оригинал</span><ArrowUpRight size={13}/><span>Аналоги</span></div>
          <div className="art-index">FP / 01</div>
        </div>
      </section>

      <section className="search-panel" aria-label="Поиск запчасти">
        <div className="workflow">
          <div className={`workflow-step ${currentStep === 1 ? 'active' : 'complete'}`}><span className="step-mark">{currentStep === 1 ? '1' : <Check size={13}/>}</span><span>Артикул детали</span></div>
          <span className="step-connector" />
          <div className={`workflow-step ${currentStep === 2 ? 'active' : ''}`}><span className="step-mark">2</span><span>Производитель</span></div>
        </div>
        <form className="search-form" onSubmit={submit}>
          <label className="search-field"><Search size={19} strokeWidth={1.8}/><input value={number} onChange={e => beginSearch(e.target.value)} placeholder="Например, 01089 или 06A905601B" aria-label="Артикул автозапчасти" autoComplete="off"/><button type="button" className="field-clear" onClick={() => beginSearch('')} aria-label="Очистить" hidden={!number}>×</button></label>
          <button className="button button-primary" type="submit" disabled={!number.trim() || brandsStatus === 'loading'}>{brandsStatus === 'loading' ? <span className="spinner spinner-light"/> : <Search size={16}/>}<span>Найти деталь</span></button>
        </form>
        <div className="search-hint"><span>Поиск по номеру или артикулу</span><span className="hint-sample">Попробуйте: <button onClick={() => beginSearch('01089')} type="button">01089</button></span></div>
      </section>

      <section className="results-section" aria-live="polite">
        {!hasSearched && <div className="welcome-strip"><div className="welcome-icon"><ShieldCheck size={18}/></div><div><strong>Подбор в два шага</strong><span>Сначала найдите артикул, затем выберите производителя, чтобы увидеть аналоги и предложения.</span></div><div className="welcome-features"><span><Sparkles size={14}/>Актуальные предложения</span><span><Truck size={14}/>Остатки по складам</span></div></div>}

        {hasSearched && <div className="results-grid">
          <aside className="brands-column">
            <div className="section-heading"><div><span className="section-kicker">Шаг 1</span><h2>Производители</h2></div><span className="count-badge">{brandsStatus === 'succeeded' ? brands.length : '—'}</span></div>
            <div className="brand-list">
              {brandsStatus === 'loading' && <Loader label="Ищем производителей…"/>}
              {brandsStatus === 'failed' && <ErrorState text={brandsError} retry={submit}/>}
              {brandsStatus === 'succeeded' && brands.length === 0 && <EmptyState title="Ничего не найдено" text="Проверьте артикул и попробуйте поискать ещё раз."/>}
              {brandsStatus === 'succeeded' && brands.map((item, index) => {
                const active = selectedBrand === item.brand;
                const info = stockInfo(item);
                return <button className={`brand-option ${active ? 'selected' : ''}`} onClick={() => chooseBrand(item.brand)} key={`${item.brand}-${item.goodsID || index}`}>
                  <span className="brand-initial">{item.brand?.slice(0, 1).toUpperCase()}</span>
                  <span className="brand-details"><strong>{item.brand}</strong><small>{item.number}{item.name ? ` · ${item.name}` : ''}</small></span>
                  <span className="brand-meta">{info.total > 0 ? <><b>{info.total}</b><small>шт.</small></> : <small className="muted">под заказ</small>}<ChevronRight size={15}/></span>
                </button>;
              })}
            </div>
          </aside>

          <div className="offers-column" ref={resultRef}>
            <div className="section-heading offers-heading"><div><span className="section-kicker">Шаг 2</span><h2>{selectedBrand ? `Предложения ${selectedBrand}` : 'Аналоги и предложения'}</h2></div>{selectedBrand && offersStatus === 'succeeded' && <span className="count-badge">{rows.length}</span>}</div>
            {!selectedBrand && offersStatus !== 'loading' && <EmptyState icon={SlidersHorizontal} title="Выберите производителя" text="После выбора загрузим оригинальную деталь, аналоги и цены по складам."/>}
            {offersStatus === 'loading' && <div className="offer-loading"><Loader label="Загружаем аналоги и предложения…"/><div className="skeleton-row"/><div className="skeleton-row"/><div className="skeleton-row"/></div>}
            {offersStatus === 'failed' && <ErrorState text={offersError} retry={() => selectedBrand && chooseBrand(selectedBrand)}/>}
            {offersStatus === 'succeeded' && rows.length === 0 && <EmptyState title="Предложений пока нет" text="По выбранному производителю сервис не вернул детали. Выберите другого производителя."/>}
            {offersStatus === 'succeeded' && rows.length > 0 && <div className="offers-table-wrap"><table className="offers-table"><thead><tr><th>Деталь</th><th>Наличие</th><th>Цена от</th><th aria-label="Подробнее"/></tr></thead><tbody>{rows.map((item, index) => {
              const stats = stockInfo(item); const id = item.goodsID || `${item.brand}-${item.number}-${index}`; const open = expandedId === id;
              const warehouses = (item.warehouses || []).filter(w => Number(w?.stock) > 0);
              return <FragmentRow key={id} item={item} id={id} index={index} stats={stats} open={open} warehouses={warehouses} onToggle={() => setExpandedId(open ? null : id)} />;
            })}</tbody></table></div>}
          </div>
        </div>}
      </section>

      <footer className="page-footer"><span>Данные предоставлены сервисом Favorit Parts</span><span><CircleHelp size={14}/> Цены и остатки обновляются при каждом запросе</span></footer>
    </main>
  </div>;
}

function FragmentRow({ item, id, index, stats, open, warehouses, onToggle }) {
  return <>
    <tr className={`${open ? 'row-open' : ''} ${index === 0 ? 'first-row' : ''}`}>
      <td><div className="part-cell"><span className={`part-chip ${index === 0 ? 'original-chip' : ''}`}>{index === 0 ? 'Оригинал' : item.brand || 'Аналог'}</span><strong>{item.name || item.brand || 'Автозапчасть'}</strong><span className="part-number">{item.brand} <i>/</i> {item.number}</span></div></td>
      <td><span className={`stock-pill ${stats.total > 0 ? 'in-stock' : 'out-stock'}`}><i/>{stats.total > 0 ? `${stats.total} шт.` : 'Нет в наличии'}</span>{stats.warehouses > 0 && <small className="warehouse-count">{stats.warehouses} {stats.warehouses === 1 ? 'склад' : stats.warehouses < 5 ? 'склада' : 'складов'}</small>}</td>
      <td><strong className="price-value">{stats.price ? fmt(stats.price) : '—'}</strong><small className="price-caption">{stats.price ? 'за единицу' : 'уточняется'}</small></td>
      <td><button className={`row-toggle ${open ? 'expanded' : ''}`} onClick={onToggle} aria-label={open ? 'Скрыть склады' : 'Показать склады'}>{open ? <ArrowUp size={15}/> : <ArrowDown size={15}/>}</button></td>
    </tr>
    {open && <tr className="warehouse-row"><td colSpan="4"><div className="warehouse-panel"><div className="warehouse-title">Предложения по складам</div>{warehouses.length ? warehouses.map((w, i) => <div className="warehouse-item" key={w.id || i}><span className="warehouse-name"><span className={w.own ? 'own-dot' : 'partner-dot'}/>{w.code || `Склад ${i + 1}`}{w.own && <small>свой</small>}</span><span>{Number(w.stock)} шт.</span><strong>{fmt(Number(w.price))}</strong></div>) : <p>Нет доступных складских предложений.</p>}</div></td></tr>}
  </>;
}
