import { ArrowUpRight } from 'lucide-react';

export default function IntroSection() {
  return (
    <section className="intro">
      <div className="intro-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> Каталог автозапчастей</div>
        <h1>Найдите деталь.<br /><span>Подберите аналог.</span></h1>
        <p className="intro-description">
          Введите артикул — покажем производителей,<br className="desktop-break" /> актуальные цены и наличие на складах.
        </p>
      </div>
      <div className="intro-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="part-disc">
          <div className="disc-inner">
            <div className="disc-hub" />
            <i /><i /><i /><i /><i /><i />
          </div>
        </div>
        <div className="art-caption"><span>Оригинал</span><ArrowUpRight size={13} /><span>Аналоги</span></div>
        <div className="art-index">FP / 01</div>
      </div>
    </section>
  );
}
