import ProductCard from "@/components/mimo/ProductCard";
import { PRODUCTS, getDiscount, type CartState } from "@/lib/menu-data";

interface ProductGridProps {
  cart: CartState;
  onUpdate: (id: string, delta: number) => void;
}

const ProductGrid = ({ cart, onUpdate }: ProductGridProps) => (
  <div className="grid grid-cols-2 gap-4 mb-10 mimo-reveal">
    {PRODUCTS.map((p, i) => (
      <ProductCard
        key={p.id}
        product={p}
        qty={cart[p.id]}
        discount={getDiscount(p.id, cart[p.id])}
        onUpdate={onUpdate}
        className={`mimo-reveal mimo-stagger-${i}`}
      />
    ))}
  </div>
);

export default ProductGrid;
