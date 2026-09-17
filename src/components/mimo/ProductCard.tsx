import { Minus, Plus, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  image: string;
  imageScale?: number;
}

interface ProductCardProps {
  product: Product;
  qty: number;
  onUpdate: (id: string, delta: number) => void;
  discount: number;
}

const ProductCard = ({ product, qty, onUpdate, discount }: ProductCardProps) => {
  const displayPrice = qty > 0
    ? (qty * product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="mimo-card flex flex-col">
      {/* Ribbon when qty > 0 */}
      {qty > 0 && (
        <div
          className="absolute top-0 left-0 z-10 flex items-start justify-start"
          style={{ clipPath: 'polygon(0 0, 40px 0, 0 40px)' }}
        >
          <div
            className="w-10 h-10 flex items-start justify-start pl-1 pt-1"
            style={{ background: '#854d3b' }}
          >
            <Check size={12} strokeWidth={3} color="#f0e6d2" />
          </div>
        </div>
      )}

      {/* Product image */}
      <div className="w-full overflow-hidden" style={{ height: 140, borderRadius: '20px 20px 0 0' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          style={product.imageScale ? { transform: `scale(${product.imageScale})` } : undefined}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center text-center flex-1">
        <h3 className="font-display font-semibold leading-tight mb-1" style={{ fontSize: 18, color: '#2e1008' }}>
          {product.name}
        </h3>
        <p className="font-body leading-tight mb-3 line-clamp-2" style={{ fontSize: 12, fontWeight: 300, color: '#a67c5b', minHeight: 32 }}>
          {product.desc}
        </p>
        <p className="font-display font-bold mb-4" style={{ fontSize: 22, color: '#2e1008' }}>
          {displayPrice}
        </p>

        <div className="flex items-center gap-3">
          <button onClick={() => onUpdate(product.id, -1)} className="mimo-qty-btn" aria-label="Diminuir quantidade">
            <Minus size={14} />
          </button>
          <span className="font-body font-medium text-center" style={{ fontSize: 16, minWidth: 28, color: '#2e1008' }}>
            {qty}
          </span>
          <button onClick={() => onUpdate(product.id, 1)} className="mimo-qty-btn" aria-label="Aumentar quantidade">
            <Plus size={14} />
          </button>
        </div>

        {discount > 0 && (
          <div className="mt-3 mimo-discount-badge" style={{ animation: 'mimo-fade-in 0.3s ease-out' }}>
            R$ {discount} de desconto aplicado
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
