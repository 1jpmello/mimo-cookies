interface FloatingCartProps {
  step: number;
  cartCount: number;
  total: number;
  canProceed: boolean;
  onNext: () => void;
}

const formatCurrency = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const FloatingCart = ({ step, cartCount, total, canProceed, onNext }: FloatingCartProps) => {
  if (step >= 3 || cartCount === 0) return null;

  return (
    <div
      className="fixed z-40"
      style={{
        bottom: 24,
        left: '50%',
        width: 'calc(100% - 48px)',
        maxWidth: 400,
        animation: 'mimo-slide-up 0.3s ease-out forwards',
      }}
    >
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="mimo-cta-float w-full flex justify-between items-center"
        style={{ padding: '18px 32px' }}
      >
        <span
          className="font-body font-semibold uppercase"
          style={{ fontSize: 15, letterSpacing: '0.08em', color: '#f0e6d2' }}
        >
          {step === 1 ? "Ver carrinho" : "Confirmar pedido"}
        </span>
        <span
          className="font-display font-semibold"
          style={{
            padding: '6px 14px',
            borderRadius: 100,
            background: 'rgba(240,230,210,0.15)',
            fontSize: 16,
            color: '#f0e6d2',
          }}
        >
          {formatCurrency(total)}
        </span>
      </button>
    </div>
  );
};

export default FloatingCart;
