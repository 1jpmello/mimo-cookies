import SubHeading from "@/components/mimo/SubHeading";
import ProductGrid from "@/components/mimo/ProductGrid";
import ComboCard from "@/components/mimo/ComboCard";
import SpecialPackaging from "@/components/mimo/SpecialPackaging";
import { COMBO, type CartState } from "@/lib/menu-data";

interface MenuStepProps {
  cart: CartState;
  onUpdate: (id: string, delta: number) => void;
}

const MenuStep = ({ cart, onUpdate }: MenuStepProps) => (
  <div className="animate-mimo-fade-in">
    <SubHeading title="Nossos Mimos" subtitle="escolha seu favorito" />
    <ProductGrid cart={cart} onUpdate={onUpdate} />

    <SubHeading title="Combo de Mimo" subtitle="o presente perfeito" />
    <ComboCard combo={COMBO} qty={cart.combo} onUpdate={onUpdate} />

    <SpecialPackaging />
  </div>
);

export default MenuStep;
