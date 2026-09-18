import { Check } from "lucide-react";

interface SuccessViewProps {
  onReset: () => void;
}

const SuccessView = ({ onReset }: SuccessViewProps) => (
  <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] animate-mimo-fade-in">
    <div className="mb-6 text-whatsapp animate-mimo-scale-in">
      <Check size={80} strokeWidth={1.5} />
    </div>
    <h2 className="font-script mb-4 text-5xl text-texto">Pedido enviado!</h2>
    <p className="font-display mb-8 text-lg text-suave">Em breve entraremos em contato para confirmar sua doçura.</p>
    <button onClick={onReset} className="font-display italic transition-colors pb-1 text-marrom-wave border-b border-marrom-wave">
      Fazer novo pedido
    </button>
  </div>
);

export default SuccessView;
