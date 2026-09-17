import { CheckCircle2 } from "lucide-react";

interface SuccessViewProps {
  onReset: () => void;
}

const SuccessView = ({ onReset }: SuccessViewProps) => {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-8 text-center animate-mimo-fade-in" style={{ background: '#f0e6d2' }}>
      <div className="text-whatsapp mb-6 animate-mimo-scale-in">
        <CheckCircle2 size={80} strokeWidth={1.5} />
      </div>
      <h2 className="font-script text-6xl mb-4" style={{ color: '#2e1008' }}>Pedido enviado!</h2>
      <p className="font-display text-xl mb-12" style={{ color: '#a67c5b' }}>
        Em breve entraremos em contato para confirmar sua doçura.
      </p>
      <button
        onClick={onReset}
        className="font-display italic pb-1 transition-colors"
        style={{ color: '#854d3b', borderBottom: '1px solid #854d3b' }}
      >
        Fazer novo pedido
      </button>
    </div>
  );
};

export default SuccessView;
