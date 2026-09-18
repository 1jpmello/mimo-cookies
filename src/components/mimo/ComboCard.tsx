import { Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Combo } from "@/lib/menu-data";

interface ComboCardProps {
  combo: Combo;
  qty: number;
  onUpdate: (id: string, delta: number) => void;
}

const ComboCard = ({ combo, qty, onUpdate }: ComboCardProps) => (
  <div
    className="relative overflow-hidden transition-all duration-300 mimo-reveal rounded-[24px] border-2 border-marrom-wave"
    style={{ background: "linear-gradient(135deg, hsl(var(--texto)) 0%, hsl(var(--marrom-wave)) 100%)", boxShadow: "0 12px 40px hsl(var(--texto) / 0.25)" }}
  >
    <div
      className="absolute top-4 right-0 z-10 font-body font-bold uppercase text-white text-[11px] tracking-[0.08em] bg-destaque"
      style={{ padding: "5px 16px 5px 20px", clipPath: "polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%)" }}
    >
      -10% OFF
    </div>

    <div className="w-full h-[180px] overflow-hidden">
      <img
        src={combo.image}
        alt={combo.name}
        loading="lazy"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-cover select-none pointer-events-none opacity-85"
      />
    </div>

    <div className="p-5 text-center">
      <h4 className="font-display font-semibold mb-1 text-[22px] text-creme">{combo.name}</h4>
      <p className="font-display italic mb-4 text-[13px] text-creme/70">{combo.desc}</p>

      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="font-body line-through text-sm text-creme/50">{formatCurrency(combo.originalPrice)}</span>
        <span className="font-display font-bold text-[32px] text-creme">{formatCurrency(combo.price)}</span>
      </div>

      <div className="inline-block font-display font-semibold mb-5 text-xs bg-creme/15 text-creme rounded-full px-3.5 py-[5px] border border-creme/20">
        Você economiza {formatCurrency(combo.originalPrice - combo.price)}!
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onUpdate(combo.id, -1)}
          className="mimo-press flex items-center justify-center rounded-full w-9 h-9 bg-creme/15 border border-creme/30 text-creme"
          aria-label="Diminuir combo"
        >
          <Minus size={16} />
        </button>
        <span className="font-body font-semibold text-xl min-w-8 text-center text-creme">{qty}</span>
        <button
          onClick={() => onUpdate(combo.id, 1)}
          className="mimo-press flex items-center justify-center rounded-full w-9 h-9 bg-creme text-marrom-wave"
          aria-label="Aumentar combo"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default ComboCard;
