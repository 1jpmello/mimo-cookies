import { formatCurrency } from "@/lib/format";

interface FloatingCartButtonProps {
  step: number;
  cartCount: number;
  total: number;
  canProceed: boolean;
  onNext: () => void;
}

const FloatingCartButton = ({ step, cartCount, total, canProceed, onNext }: FloatingCartButtonProps) => {
  if (step >= 3 || cartCount === 0) return null;

  return (
    <div
      className="fixed z-40 bottom-6 left-1/2 w-[calc(100%-48px)] max-w-[400px]"
      style={{ animation: "mimo-slide-up 0.3s ease-out forwards" }}
    >
      <div className="absolute flex items-center justify-center rounded-full font-body font-bold -top-2 -right-1 w-6 h-6 text-[11px] bg-destaque text-creme" style={{ boxShadow: "0 2px 8px hsl(var(--destaque) / 0.4)", zIndex: 1 }}>
        {cartCount}
      </div>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full flex justify-between items-center transition-all rounded-full py-4 px-7 bg-marrom-wave"
        style={{ boxShadow: "0 10px 32px hsl(var(--texto) / 0.4)", opacity: canProceed ? 1 : 0.5 }}
      >
        <span className="font-body font-semibold uppercase text-sm tracking-[0.08em] text-creme">
          {step === 1 ? "Ver carrinho" : "Confirmar pedido"}
        </span>
        <span className="font-display font-semibold rounded-full px-3 py-[5px] bg-creme/15 text-[15px] text-creme">
          {formatCurrency(total)}
        </span>
      </button>
    </div>
  );
};

export default FloatingCartButton;
