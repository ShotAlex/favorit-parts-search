function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span /><span /><span /><span />
    </div>
  );
}

export default function AppHeader() {
  return (
    <header className="topbar">
      <a className="identity" href="#top" aria-label="Favorit Parts — главная">
        <BrandMark />
        <span>favorit<span className="identity-light">parts</span></span>
      </a>
      <div className="topbar-right">
        <span className="api-status"><i /> Сервис доступен</span>
        <span className="topbar-divider" />
        <span className="portal-label">Подбор по каталогу</span>
      </div>
    </header>
  );
}
