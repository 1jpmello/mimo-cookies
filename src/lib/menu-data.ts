import cookieAoLeite from "@/assets/cookie-ao-leite.jpg";
import cookieNinho from "@/assets/ninho.jpg";
import cookieOreo from "@/assets/oreo.jpg";
import cookieKinder from "@/assets/kinder.jpg";
import comboFoto from "@/assets/combo-mimo.png";

export interface Product {
  id: string;
  name: string;
  desc: string;
  descHighlight?: string;
  price: number;
  image: string;
  imageScale?: number;
}

export interface Combo {
  id: string;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  image: string;
}

export const PRODUCTS: Product[] = [
  { id: "ao-leite", name: "Ao Leite", desc: "Massa de cookie de baunilha com gotas de chocolate ao leite e recheio cremoso de brigadeiro de Chocolate Garoto", descHighlight: "Chocolate Garoto", price: 20, image: cookieAoLeite },
  { id: "ninho", name: "Ninho", desc: "Massa de cookie de baunilha com gotas de chocolate branco e recheio cremoso de brigadeiro de Leite Ninho", descHighlight: "Leite Ninho", price: 22, image: cookieNinho, imageScale: 1.3 },
  { id: "oreo", name: "Oreo", desc: "Massa de cookie de baunilha com gotas de chocolate branco e delicioso recheio de brigadeiro de Oreo com pedaços crocantes", descHighlight: "Oreo", price: 26, image: cookieOreo },
  { id: "kinder", name: "Kinder", desc: "Massa de cookie de baunilha com gotas de chocolate branco e ao leite, com recheio cremoso de brigadeiro sabor Kinder Bueno White", descHighlight: "Kinder Bueno White", price: 30, image: cookieKinder },
];

export const COMBO: Combo = {
  id: "combo",
  name: "Combo de Mimo",
  desc: "Uma seleção especial com os quatro sabores: Ao Leite, Ninho, Oreo e Kinder; em uma única experiência",
  price: 88,
  originalPrice: 98,
  image: comboFoto,
};

export const WHATSAPP_NUMBER = "5521998016799";

export type CartState = Record<string, number>;

export const initialCart: CartState = { "ao-leite": 0, ninho: 0, oreo: 0, kinder: 0, combo: 0 };

/** Desconto progressivo por sabor: 2 un. = R$3 off, 3+ un. = R$6 off. O combo já vem com preço fechado. */
export const getDiscount = (id: string, qty: number) => {
  if (id === "combo" || qty < 2) return 0;
  return qty >= 3 ? 6 : 3;
};

export function getCartItem(id: string): Product | Combo {
  return id === "combo" ? COMBO : (PRODUCTS.find((p) => p.id === id) as Product);
}
