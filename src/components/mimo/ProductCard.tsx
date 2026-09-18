import { Minus, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/menu-data";

interface ProductCardProps {
  product: Product;
  qty: number;
  discount: number;
  onUpdate: (id: string, delta: number) => void;
  className?: string;
}

const ProductCard = ({ product, qty, discount, onUpdate, className }: ProductCardProps) => (
  <div
    className={cn(
      "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 rounded-[20px] bg-creme shadow-[0_4px_20px_hsl(var(--marrom-wave)/0.12)]",
      qty > 0 ? "border-2 border-marrom-wave" : "border border-marrom-wave/30",
      className,
    )}
  >
    {qty > 0 && (
      <div className="absolute top-0 left-0 z-10" style={{ clipPath: "polygon(0 0, 36px 0, 0 36px)" }}>
        <div className="flex items-start justify-start pl-1 pt-1 w-9 h-9 bg-marrom-wave">
          <Check size={11} strokeWidth={3} className="text-creme" />
        </div>
      </div>
    )}

    <div className="w-full h-[150px] overflow-hidden rounded-t-[20px]">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-cover select-none pointer-events-none"
        style={product.imageScale ? { transform: `scale(${product.imageScale})` } : undefined}
      />
    </div>

    <div className="p-3 flex flex-col items-center text-center">
      <h4 className="font-display font-semibold mb-0.5 text-[17px] text-texto">{product.name}</h4>
      <p className="font-body mb-2 text-[11px] font-light text-suave min-h-[28px]">
        {product.descHighlight ? (
          <>
            {product.desc.split(product.descHighlight)[0]}
            <span className="font-bold text-marrom-wave">{product.descHighlight}</span>
            {product.desc.split(product.descHighlight)[1]}
          </>
        ) : (
          product.desc
        )}
      </p>
      <p className="font-display font-bold mb-3 text-xl text-texto">
        {formatCurrency(qty > 0 ? qty * product.price : product.price)}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdate(product.id, -1)}
          className="mimo-press flex items-center justify-center rounded-full w-[30px] h-[30px] bg-creme border border-marrom-wave/30 text-texto"
          aria-label={`Diminuir ${product.name}`}
        >
          <Minus size={13} />
        </button>
        <span className="font-body font-medium text-center text-[15px] min-w-[24px] text-texto">{qty}</span>
        <button
          onClick={() => onUpdate(product.id, 1)}
          className="mimo-press flex items-center justify-center rounded-full w-[30px] h-[30px] bg-marrom-wave text-creme"
          aria-label={`Aumentar ${product.name}`}
        >
          <Plus size={13} />
        </button>
      </div>

      {discount > 0 && (
        <div className="mt-2 font-body mimo-discount-badge animate-mimo-fade-in">R$ {discount} de desconto</div>
      )}
    </div>
  </div>
);

export default ProductCard;
