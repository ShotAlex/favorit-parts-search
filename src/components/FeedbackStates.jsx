import { PackageSearch, RotateCcw } from 'lucide-react';

export function Loader({ label }) {
  return (
    <div className="inline-state" role="status" aria-live="polite" aria-atomic="true">
      <span className="spinner" aria-hidden="true" />{label}
    </div>
  );
}

export function EmptyState({ icon: Icon = PackageSearch, title, text, action }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon" aria-hidden="true"><Icon size={22} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function ErrorState({ text, retry }) {
  return (
    <div className="error-state" role="alert">
      <div>
        <strong>Не получилось загрузить данные</strong>
        <p>{text}</p>
      </div>
      {retry && (
        <button className="button button-light" onClick={retry}>
          <RotateCcw size={15} /> Повторить
        </button>
      )}
    </div>
  );
}
