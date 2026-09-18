import { ArrowLeft } from "lucide-react";
import { formatCurrency, formatPhone } from "@/lib/format";
import { getCartItem, getDiscount, type CartState } from "@/lib/menu-data";
import { isTrackingEnabled } from "@/lib/analytics";

export interface UserData {
  name: string;
  phone: string;
  obs: string;
}

interface Totals {
  subtotal: number;
  totalDiscount: number;
  total: number;
}

interface CartStepProps {
  cart: CartState;
  userData: UserData;
  totals: Totals;
  onBack: () => void;
  onRemove: (id: string, qty: number) => void;
  onChangeUserData: (data: UserData) => void;
}

const CartStep = ({ cart, userData, totals, onBack, onRemove, onChangeUserData }: CartStepProps) => (
  <div className="animate-mimo-fade-in">
    <button onClick={onBack} className="flex items-center gap-2 mb-6 font-display italic transition-colors text-marrom-wave">
      <ArrowLeft size={18} /> Voltar ao cardápio
    </button>
    <h3 className="font-script mb-6 mimo-shimmer text-[40px] text-texto" style={{ textShadow: "0 0 20px rgba(201,169,110,0.2)" }}>
      Seu pedido
    </h3>

    <div className="space-y-3 mb-6">
      {Object.entries(cart).map(([id, qty]) => {
        if (qty === 0) return null;
        const item = getCartItem(id);
        const disc = getDiscount(id, qty);
        const itemTotal = item.price * qty - disc;
        return (
          <div key={id} className="p-4 flex justify-between items-center rounded-2xl bg-creme border border-marrom-wave/25" style={{ boxShadow: "0 4px 16px hsl(var(--texto) / 0.06)" }}>
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover" />
              <div>
                <p className="font-display font-semibold text-[15px] text-texto">{item.name}</p>
                <p className="font-body text-xs text-suave">
                  {qty}x {formatCurrency(item.price)}
                </p>
              </div>
            </div>
            <div className="text-right">
              {disc > 0 && <p className="font-body line-through text-[11px] text-suave">{formatCurrency(item.price * qty)}</p>}
              <p className="font-display font-semibold text-[17px] text-texto">{formatCurrency(itemTotal)}</p>
              <button onClick={() => onRemove(id, qty)} className="font-body uppercase tracking-widest text-[10px] text-marrom-wave">
                Remover
              </button>
            </div>
          </div>
        );
      })}
    </div>

    <div className="p-5 mb-6 rounded-[20px] bg-creme border border-marrom-wave/25">
      <div className="flex justify-between text-sm mb-2 font-body text-texto">
        <span>Subtotal</span>
        <span>{formatCurrency(totals.subtotal)}</span>
      </div>
      {totals.totalDiscount > 0 && (
        <div className="flex justify-between text-sm mb-3 font-body text-marrom">
          <span>Descontos</span>
          <span>-{formatCurrency(totals.totalDiscount)}</span>
        </div>
      )}
      <div className="mb-3 mimo-gold-line" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)" }} />
      <div className="flex justify-between font-display font-bold text-[22px] text-texto">
        <span>Total</span>
        <span>{formatCurrency(totals.total)}</span>
      </div>
    </div>

    <div className="space-y-3">
      <input
        type="text"
        placeholder="Seu nome"
        className="mimo-input"
        value={userData.name}
        onChange={(e) => onChangeUserData({ ...userData, name: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Telefone (WhatsApp)"
        className="mimo-input"
        value={userData.phone}
        onChange={(e) => onChangeUserData({ ...userData, phone: formatPhone(e.target.value) })}
      />
      <textarea
        placeholder="Observações (opcional)"
        className="mimo-input h-24 resize-none"
        value={userData.obs}
        onChange={(e) => onChangeUserData({ ...userData, obs: e.target.value })}
      />
    </div>

    {isTrackingEnabled && (
      <p className="mt-3 font-body text-[11px] leading-relaxed text-suave">
        Seu nome e telefone podem ser usados para follow-up sobre este pedido (ex.: lembrete de carrinho não finalizado).
      </p>
    )}
  </div>
);

export default CartStep;
