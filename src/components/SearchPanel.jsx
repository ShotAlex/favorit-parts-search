import { Check, Search } from 'lucide-react';

function SearchSteps({ currentStep }) {
  return (
    <div className="workflow">
      <div className={`workflow-step ${currentStep === 1 ? 'active' : 'complete'}`}>
        <span className="step-mark">{currentStep === 1 ? '1' : <Check size={13} />}</span>
        <span>Артикул детали</span>
      </div>
      <span className="step-connector" />
      <div className={`workflow-step ${currentStep === 2 ? 'active' : ''}`}>
        <span className="step-mark">2</span>
        <span>Производитель</span>
      </div>
    </div>
  );
}

export default function SearchPanel({
  number,
  currentStep,
  isLoading,
  onChange,
  onSubmit,
}) {
  return (
    <section className="search-panel" aria-label="Поиск запчасти">
      <SearchSteps currentStep={currentStep} />
      <form className="search-form" onSubmit={onSubmit}>
        <label className="search-field">
          <Search size={19} strokeWidth={1.8} />
          <input
            value={number}
            onChange={event => onChange(event.target.value)}
            placeholder="Например, 01089 или 06A905601B"
            aria-label="Артикул автозапчасти"
            autoComplete="off"
          />
          <button
            type="button"
            className="field-clear"
            onClick={() => onChange('')}
            aria-label="Очистить"
            hidden={!number}
          >×</button>
        </label>
        <button className="button button-primary" type="submit" disabled={!number.trim() || isLoading}>
          {isLoading ? <span className="spinner spinner-light" /> : <Search size={16} />}
          <span>Найти деталь</span>
        </button>
      </form>
      <div className="search-hint">
        <span>Поиск по номеру или артикулу</span>
        <span className="hint-sample">Попробуйте: <button onClick={() => onChange('01089')} type="button">01089</button></span>
      </div>
    </section>
  );
}
