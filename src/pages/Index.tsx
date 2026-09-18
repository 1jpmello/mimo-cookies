import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency, sanitizeInput } from "@/lib/format";
import { WHATSAPP_NUMBER, initialCart, getDiscount, getCartItem, type CartState } from "@/lib/menu-data";
import { scrollTo } from "@/lib/dom";
import HeroSection from "@/components/mimo/HeroSection";
import SectionBanner from "@/components/mimo/SectionBanner";
import MenuStep from "@/components/mimo/MenuStep";
import CartStep, { type UserData } from "@/components/mimo/CartStep";
import ConfirmationStep from "@/components/mimo/ConfirmationStep";
import SuccessView from "@/components/mimo/SuccessView";
import AboutGallery from "@/components/mimo/AboutGallery";
import SiteFooter from "@/components/mimo/SiteFooter";
import FloatingCartButton from "@/components/mimo/FloatingCartButton";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const MAX_ORDERS_PER_MINUTE = 5;

const OrderProgress = ({ step }: { step: number }) => (
  <div className="flex justify-center items-center gap-4 mb-8">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-full transition-all duration-500"
        style={{
          height: 6,
          width: step >= i ? 32 : 8,
          background: step >= i ? "hsl(var(--marrom-wave))" : "hsl(var(--texto) / 0.15)",
          boxShadow: step >= i ? "0 0 8px hsl(var(--dourado) / 0.3)" : "none",
        }}
      />
    ))}
  </div>
);

const Index = () => {
  const revealRef = useScrollReveal();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>(initialCart);
  const [userData, setUserData] = useState<UserData>({ name: "", phone: "", obs: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendNotice, setSendNotice] = useState<string | null>(null);
  const orderTimestamps = useRef<number[]>([]);
  const leadCapturedRef = useRef(false);

  useEffect(() => {
    trackEvent("page_view");
  }, []);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      if (qty === 0) return;
      subtotal += getCartItem(id).price * qty;
      totalDiscount += getDiscount(id, qty);
    });
    return { subtotal, totalDiscount, total: subtotal - totalDiscount };
  }, [cart]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const nextQty = Math.max(0, prev[id] + delta);
      if (delta > 0) trackEvent("add_to_cart", { productId: id, quantity: nextQty });
      else if (nextQty === 0 && prev[id] > 0) trackEvent("remove_from_cart", { productId: id });
      return { ...prev, [id]: nextQty };
    });
  };

  const handleSendWhatsApp = useCallback(() => {
    const now = Date.now();
    orderTimestamps.current = orderTimestamps.current.filter((t) => now - t < 60000);
    if (orderTimestamps.current.length >= MAX_ORDERS_PER_MINUTE) {
      setSendNotice("Aguarde um momento antes de enviar outro pedido.");
      return;
    }
    orderTimestamps.current.push(now);
    setSendNotice(null);

    const safeName = sanitizeInput(userData.name);
    const safePhone = sanitizeInput(userData.phone);
    const safeObs = sanitizeInput(userData.obs);

    let message = `Olá! Gostaria de fazer um pedido da Mimô Cookies\n\nMEU PEDIDO:\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      if (qty === 0) return;
      const item = getCartItem(id);
      const disc = getDiscount(id, qty);
      const itemTotal = item.price * qty - disc;
      message += `• ${qty}x ${item.name} — ${formatCurrency(itemTotal)}${disc > 0 ? ` (desconto R$ ${disc})` : ""}\n`;
    });
    message += `\nTotal: ${formatCurrency(totals.total)}`;
    message += `\n\nNome: ${safeName}`;
    message += `\nTelefone: ${safePhone}`;
    if (safeObs) message += `\nObs: ${safeObs}`;
    message += `\n\nAguardo confirmação!`;

    trackEvent("order_completed", { name: safeName, phone: safePhone, cartTotal: totals.total, cartCount });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setIsSuccess(true);
  }, [cart, userData, totals.total, cartCount]);

  const resetAll = () => {
    setCart(initialCart);
    setStep(1);
    setUserData({ name: "", phone: "", obs: "" });
    setIsSuccess(false);
    setSendNotice(null);
    leadCapturedRef.current = false;
  };

  const canProceed =
    step === 1 ? cartCount >= 1 : sanitizeInput(userData.name).length > 0 && userData.phone.replace(/\D/g, "").length >= 10;

  useEffect(() => {
    if (step !== 2 || leadCapturedRef.current) return;
    const validName = sanitizeInput(userData.name).length > 0;
    const validPhone = userData.phone.replace(/\D/g, "").length >= 10;
    if (validName && validPhone) {
      leadCapturedRef.current = true;
      trackEvent("lead_captured", {
        name: sanitizeInput(userData.name),
        phone: sanitizeInput(userData.phone),
        cartTotal: totals.total,
        cartCount,
      });
    }
  }, [step, userData.name, userData.phone, totals.total, cartCount]);

  return (
    <div ref={revealRef} className="font-body antialiased bg-marrom-wave">
      <HeroSection />

      <section id="pedir">
        <SectionBanner title="Faça seu pedido" font="script" paddingTop={24} paddingBottom={16} />

        <div className="bg-creme -mt-px">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full block h-10">
            <path d="M0,0 Q180,28 360,14 Q540,0 720,14 Q900,28 1080,14 Q1260,0 1440,14 V0 Z" fill="hsl(var(--marrom-wave))" />
          </svg>
        </div>

        <div className="mimo-section-fade bg-creme">
          {isSuccess ? (
            <SuccessView onReset={resetAll} />
          ) : (
            <div className="max-w-lg mx-auto px-5 py-8" style={{ paddingBottom: cartCount > 0 ? 120 : 40 }}>
              <OrderProgress step={step} />

              {step === 1 && <MenuStep cart={cart} onUpdate={updateQty} />}

              {step === 2 && (
                <CartStep
                  cart={cart}
                  userData={userData}
                  totals={totals}
                  onBack={() => setStep(1)}
                  onRemove={(id, qty) => updateQty(id, -qty)}
                  onChangeUserData={setUserData}
                />
              )}

              {step === 3 && (
                <>
                  {sendNotice && (
                    <p className="mb-4 font-body text-sm text-destaque" role="alert">
                      {sendNotice}
                    </p>
                  )}
                  <ConfirmationStep cart={cart} userData={userData} total={totals.total} onSend={handleSendWhatsApp} />
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="sobre">
        <SectionBanner title="Cookies" font="display" paddingTop={12} paddingBottom={24} />
        <AboutGallery />
        <SiteFooter />
      </section>

      {!isSuccess && (
        <FloatingCartButton
          step={step}
          cartCount={cartCount}
          total={totals.total}
          canProceed={canProceed}
          onNext={() => {
            if (step === 1) trackEvent("checkout_started", { cartTotal: totals.total, cartCount });
            setStep((s) => s + 1);
            scrollTo("pedir");
          }}
        />
      )}
    </div>
  );
};

export default Index;
