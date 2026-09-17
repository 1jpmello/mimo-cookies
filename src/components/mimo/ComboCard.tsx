import { Minus, Plus } from "lucide-react";

interface ComboProduct {
  id: string;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  emoji: string;
  image: string;
}

interface ComboCardProps {
  product: ComboProduct;
  qty: number;
  onUpdate: (id: string, delta: number) => void;
}

const ComboCard = ({ product, qty, onUpdate }: ComboCardProps) => {
  return (
    <div className="mimo-combo-card relative mb-10">
      <div
        className="absolute top-4 right-4 z-10 font-body font-bold rounded-full"
        style={{ fontSize: 11, padding: '4px 12px', background: '#854d3b', color: '#f0e6d2' }}
      >
        PÁSCOA
      </div>

      <div className="w-full overflow-hidden" style={{ height: 180 }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="p-6">
        <h3 className="font-display font-semibold text-xl mb-1" style={{ color: '#2e1008' }}>{product.name}</h3>
        <p className="font-body mb-4" style={{ fontSize: 13, fontWeight: 300, color: '#a67c5b' }}>
          {product.desc}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-body line-through" style={{ fontSize: 14, color: '#a67c5b' }}>
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              <span className="font-display font-bold" style={{ fontSize: 28, color: '#2e1008' }}>
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <span
              className="inline-block px-3 py-1 rounded-full font-body font-bold"
              style={{ fontSize: 12, background: 'rgba(133,77,59,0.1)', color: '#7a3d28' }}
            >
              Você economiza R$ {(product.originalPrice - product.price).toFixed(2).replace(".", ",")}!
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onUpdate(product.id, -1)} className="mimo-qty-btn" aria-label="Diminuir combo">
              <Minus size={14} />
            </button>
            <span className="font-body font-medium text-center" style={{ fontSize: 16, minWidth: 28, color: '#2e1008' }}>{qty}</span>
            <button onClick={() => onUpdate(product.id, 1)} className="mimo-qty-btn" aria-label="Aumentar combo">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboCard;
