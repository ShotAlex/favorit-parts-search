import { ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function WelcomePanel() {
  return (
    <div className="welcome-strip">
      <div className="welcome-icon"><ShieldCheck size={18} /></div>
      <div>
        <strong>Подбор в два шага</strong>
        <span>Сначала найдите артикул, затем выберите производителя, чтобы увидеть аналоги и предложения.</span>
      </div>
      <div className="welcome-features">
        <span><Sparkles size={14} />Актуальные предложения</span>
        <span><Truck size={14} />Остатки по складам</span>
      </div>
    </div>
  );
}
