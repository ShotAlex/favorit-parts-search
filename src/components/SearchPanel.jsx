import { Check, Search } from 'lucide-react';

function SearchSteps({ currentStep }) {
  return (
    <ol className="workflow" aria-label="Этапы подбора">
      <li
        className={`workflow-step ${currentStep === 1 ? 'active' : 'complete'}`}
        aria-current={currentStep === 1 ? 'step' : undefined}
      >
        <span className="step-mark" aria-hidden="true">
          {currentStep === 1 ? '1' : <Check size={13} />}
        </span>
        <span>Артикул детали</span>
      </li>
      <li className="step-connector" aria-hidden="true" />
      <li
        className={`workflow-step ${currentStep === 2 ? 'active' : ''}`}
        aria-current={currentStep === 2 ? 'step' : undefined}
      >
        <span className="step-mark" aria-hidden="true">2</span>
        <span>Производитель</span>
      </li>
    </ol>
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
      <form className="search-form" onSubmit={onSubmit} role="search" aria-label="Поиск автозапчасти">
        <label className="sr-only" htmlFor="part-number">Артикул автозапчасти</label>
        <div className="search-field">
          <Search size={19} strokeWidth={1.8} aria-hidden="true" />
          <input
            id="part-number"
            value={number}
            onChange={event => onChange(event.target.value)}
            placeholder="Например, 01089 или 06A905601B"
            aria-describedby="search-help"
            autoComplete="off"
          />
          <button
            type="button"
            className="field-clear"
            onClick={() => onChange('')}
            aria-label="Очистить"
            hidden={!number}
          >×</button>
        </div>
        <button className="button button-primary" type="submit" disabled={!number.trim() || isLoading}>
          {isLoading ? <span className="spinner spinner-light" /> : <Search size={16} />}
          <span>Найти деталь</span>
        </button>
      </form>
      <div className="search-hint">
        <span id="search-help">Поиск по номеру или артикулу</span>
        <span className="hint-sample">Попробуйте: <button onClick={() => onChange('01089')} type="button">01089</button></span>
      </div>
    </section>
  );
}
