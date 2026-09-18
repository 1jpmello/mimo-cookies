import { Gift, Send } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { getCartItem, getDiscount, type CartState } from "@/lib/menu-data";
import type { UserData } from "@/components/mimo/CartStep";

interface ConfirmationStepProps {
  cart: CartState;
  userData: UserData;
  total: number;
  onSend: () => void;
}

const ConfirmationStep = ({ cart, userData, total, onSend }: ConfirmationStepProps) => (
  <div className="text-center animate-mimo-fade-in">
    <div className="mb-5 flex justify-center">
      <Gift size={44} className="text-marrom-wave" />
    </div>
    <h3 className="font-script mb-2 mimo-shimmer text-[44px] text-texto" style={{ textShadow: "0 0 20px rgba(201,169,110,0.25)" }}>
      Pedido pronto!
    </h3>
    <p className="font-display italic mb-8 text-[15px] text-suave">Confira antes de enviar</p>

    <div className="p-5 text-left mb-8 rounded-[20px] rotate-1 bg-marrom-wave text-creme" style={{ boxShadow: "0 16px 40px hsl(var(--texto) / 0.3)" }}>
      <p className="font-body uppercase tracking-wider opacity-50 mb-3 text-[10px]">Preview da mensagem:</p>
      <div className="space-y-1 font-body text-[13px]">
        <p>Olá! Gostaria de fazer um pedido...</p>
        {Object.entries(cart).map(([id, qty]) => {
          if (qty === 0) return null;
          const item = getCartItem(id);
          return (
            <p key={id}>
              • {qty}x {item.name} — {formatCurrency(item.price * qty - getDiscount(id, qty))}
            </p>
          );
        })}
        <p className="mt-2 font-bold">Total: {formatCurrency(total)}</p>
        <p>Nome: {userData.name}</p>
      </div>
    </div>

    <button
      onClick={onSend}
      className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all bg-whatsapp text-creme text-[15px]"
      style={{ boxShadow: "0 8px 24px hsl(var(--whatsapp) / 0.3)" }}
    >
      <Send size={18} /> Enviar pelo WhatsApp
    </button>
  </div>
);

export default ConfirmationStep;
