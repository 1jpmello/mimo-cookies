import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Send, Gift, Minus, Plus, Check, Instagram, ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { trackEvent } from "@/lib/analytics";
import HeroParticles from "@/components/mimo/HeroParticles";
import logoMimo from "@/assets/logo-mimo.png";
import heroBg from "@/assets/hero-bg.jpg";
import heroBgDesktop from "@/assets/hero-bg-desktop.jpg";
import produtoVideo from "@/assets/produto-video.mp4";
import cookieAoLeite from "@/assets/cookie-ao-leite.jpg";
import cookieNinho from "@/assets/ninho.jpg";
import cookieOreo from "@/assets/oreo.jpg";
import cookieKinder from "@/assets/kinder.jpg";
import embalagemPascoa from "@/assets/embalagem-pascoa.png";
import comboFoto from "@/assets/combo-mimo.png";
import sobreVideo1 from "@/assets/sobre-video-1.mp4";
import sobreVideo2 from "@/assets/sobre-video-2.mp4";
import sobreVideo3 from "@/assets/sobre-video-3.mp4";
import sobreVideo4 from "@/assets/sobre-video-4.mp4";
import sobreImage5 from "@/assets/sobre-image-5.jpeg";
import sobreVideo5 from "@/assets/sobre-video-5.mp4";

const PRODUCTS = [
  { id: "ao-leite", name: "Ao Leite", desc: "Massa de cookie de baunilha com gotas de chocolate ao leite e recheio cremoso de brigadeiro de Chocolate Garoto", descHighlight: "Chocolate Garoto", price: 20, image: cookieAoLeite },
  { id: "ninho", name: "Ninho", desc: "Massa de cookie de baunilha com gotas de chocolate branco e recheio cremoso de brigadeiro de Leite Ninho", descHighlight: "Leite Ninho", price: 22, image: cookieNinho, imageScale: 1.3 },
  { id: "oreo", name: "Oreo", desc: "Massa de cookie de baunilha com gotas de chocolate branco e delicioso recheio de brigadeiro de Oreo com pedaços crocantes", descHighlight: "Oreo", price: 26, image: cookieOreo },
  { id: "kinder", name: "Kinder", desc: "Massa de cookie de baunilha com gotas de chocolate branco e ao leite, com recheio cremoso de brigadeiro sabor Kinder Bueno White", descHighlight: "Kinder Bueno White", price: 30, image: cookieKinder },
];

const COMBO = {
  id: "combo",
  name: "Combo de Mimo",
  desc: "Uma seleção especial com os quatro sabores: Ao Leite, Ninho, Oreo e Kinder; em uma única experiência",
  price: 88,
  originalPrice: 98,
  image: comboFoto,
};

const WHATSAPP_NUMBER = "5521998016799";

type CartState = Record<string, number>;
const initialCart: CartState = { "ao-leite": 0, ninho: 0, oreo: 0, kinder: 0, combo: 0 };

const getDiscount = (id: string, qty: number) => {
  if (id === "combo" || qty < 2) return 0;
  return qty >= 3 ? 6 : 3;
};

const formatCurrency = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const sanitizeInput = (input: string): string =>
  input.replace(/[<>"'`\\{}]/g, "").trim();

const MAX_ORDERS_PER_MINUTE = 5;

const Index = () => {
  const revealRef = useScrollReveal();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>(initialCart);
  const [userData, setUserData] = useState({ name: "", phone: "", obs: "" });
  const [isSuccess, setIsSuccess] = useState(false);
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
      const product = id === "combo" ? COMBO : PRODUCTS.find((p) => p.id === id)!;
      subtotal += product.price * qty;
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
      alert("Aguarde um momento antes de enviar outro pedido.");
      return;
    }
    orderTimestamps.current.push(now);

    const safeName = sanitizeInput(userData.name);
    const safePhone = sanitizeInput(userData.phone);
    const safeObs = sanitizeInput(userData.obs);

    let message = `Olá! Gostaria de fazer um pedido da Mimô Cookies\n\nMEU PEDIDO:\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      if (qty === 0) return;
      const p = id === "combo" ? COMBO : PRODUCTS.find((x) => x.id === id)!;
      const disc = getDiscount(id, qty);
      const itemTotal = p.price * qty - disc;
      message += `• ${qty}x ${p.name} — ${formatCurrency(itemTotal)}${disc > 0 ? ` (desconto R$ ${disc})` : ""}\n`;
    });
    message += `\nTotal: ${formatCurrency(totals.total)}`;
    message += `\n\nNome: ${safeName}`;
    message += `\nTelefone: ${safePhone}`;
    if (safeObs) message += `\nObs: ${safeObs}`;
    message += `\n\nAguardo confirmação!`;
    trackEvent("order_completed", {
      name: safeName,
      phone: safePhone,
      cartTotal: totals.total,
      cartCount,
    });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setIsSuccess(true);
  }, [cart, userData, totals.total, cartCount]);

  const resetAll = () => {
    setCart(initialCart);
    setStep(1);
    setUserData({ name: "", phone: "", obs: "" });
    setIsSuccess(false);
    leadCapturedRef.current = false;
  };

  const canProceed = step === 1 ? cartCount >= 1 : !!(sanitizeInput(userData.name).length > 0 && userData.phone.replace(/\D/g, "").length >= 10);

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
    <div ref={revealRef} className="font-body antialiased" style={{ background: '#854c3a' }}>

      {/* ════════════════════════════════════════════ */}
      {/* SEÇÃO 1 — LANDING / HERO                    */}
      {/* ════════════════════════════════════════════ */}
      <section
        id="inicio"
        className="relative w-full overflow-hidden mimo-hero-section"
        style={{
          height: '100dvh',
          '--hero-bg-desktop': `url(${heroBgDesktop})`,
        } as React.CSSProperties}
      >
        <img
          src={heroBg}
          alt="Mimô Cookies"
          className="absolute inset-0 w-full h-full object-cover mimo-hero-mobile-bg"
          style={{ transform: 'scale(1.05)' }}
        />
        <div className="mimo-hero-mobile-bg">
          <HeroParticles />
        </div>
        {/* Conteúdo central do hero */}
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center overflow-visible" style={{ paddingTop: 70, paddingBottom: 60 }}>
          
          {/* Título */}
          <h1
            className="font-script text-center w-full overflow-visible"
            style={{
              fontSize: 52,
              color: '#2e1008',
              lineHeight: 1.2,
              marginBottom: 8,
              padding: '0 20px 0 38px',
              filter: 'drop-shadow(0 0 18px rgba(201,169,110,0.35)) drop-shadow(0 0 36px rgba(201,169,110,0.15))',
            }}
          >
            <span
              className="mimo-shimmer"
              style={{
                background: 'linear-gradient(135deg, #2e1008 0%, #854d3b 50%, #2e1008 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Mimô Cookies
            </span>
          </h1>

          {/* Subtítulo */}
          <span
            className="font-display uppercase text-center mimo-badge-pulse"
            style={{
              fontSize: 11,
              letterSpacing: '0.25em',
              color: '#854d3b',
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            Artesanal
          </span>

          {/* Vídeo com glow */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[24px] animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(133,77,59,0.3) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            <video
              src={produtoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="relative object-cover"
              style={{
                width: 200,
                height: 250,
                borderRadius: 20,
                  boxShadow: '0 10px 40px rgba(46,16,8,0.25), 0 0 24px rgba(133,77,59,0.15), 0 0 20px rgba(201,169,110,0.12)',
                  border: '2px solid rgba(201,169,110,0.3)',
                }}
            />
            <img
              src={logoMimo}
              alt="Mimô"
              style={{
                position: 'absolute',
                bottom: -16,
                right: -16,
                width: 56,
                height: 56,
                borderRadius: '50%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                transform: 'rotate(12deg)',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Texto Edição Especial */}
          <p
            className="font-display text-center"
            style={{
              marginTop: 28,
              fontSize: 13,
              fontWeight: 600,
              color: '#854d3b',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 1px 6px rgba(133,77,59,0.3), 0 0 16px rgba(201,169,110,0.25)',
            }}
          >
            Edição Especial Páscoa
          </p>

          {/* Scroll down indicator */}
          <div
            className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2 cursor-pointer"
            style={{ transform: 'translateX(-50%)' }}
            onClick={() => scrollTo('pedir')}
          >
            <span
              className="font-display uppercase"
              style={{
                fontSize: 9,
                letterSpacing: '0.3em',
                color: '#854d3b',
                opacity: 0.6,
              }}
            >
              Deslize
            </span>
            <div className="flex flex-col items-center" style={{ animation: 'mimo-bounce-down 2s ease-in-out infinite' }}>
              <ChevronDown size={18} style={{ color: '#854d3b', opacity: 0.5, marginBottom: -6 }} />
              <ChevronDown size={18} style={{ color: '#854d3b', opacity: 0.35, marginBottom: -6 }} />
              <ChevronDown size={18} style={{ color: '#854d3b', opacity: 0.2 }} />
            </div>
          </div>
        </div>
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-center gap-12 z-10" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)', paddingBottom: 12 }}>
          {[
            { label: "Início", target: "inicio" },
            { label: "Pedir", target: "pedir" },
            { label: "Cookies", target: "sobre" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.target)}
              className="font-display transition-colors"
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#f0e6d2',
                letterSpacing: '0.04em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* SEÇÃO 2 — SISTEMA DE PEDIDOS                */}
      {/* ════════════════════════════════════════════ */}
      <section id="pedir">
        {/* Section divider with centered title */}
        <div className="flex items-center justify-center" style={{ background: '#854c3a', paddingTop: 24, paddingBottom: 16 }}>
          <div className="mimo-gold-line" style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), rgba(240,230,210,0.25))', marginLeft: 32 }} />
          <div className="flex items-center gap-2">
            <span className="mimo-gold-dot" />
            <h2 className="font-script px-3 mimo-shimmer" style={{ fontSize: 32, color: '#f0e6d2', letterSpacing: '0.02em' }}>
              Faça seu pedido
            </h2>
            <span className="mimo-gold-dot" />
          </div>
          <div className="mimo-gold-line" style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(240,230,210,0.25), rgba(201,169,110,0.5), transparent)', marginRight: 32 }} />
        </div>

        {/* Subtle wave transition */}
        <div style={{ background: '#f0e6d2', marginTop: -1 }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full block" style={{ height: 40 }}>
            <path
              d="M0,0 Q180,28 360,14 Q540,0 720,14 Q900,28 1080,14 Q1260,0 1440,14 V0 Z"
              fill="#854d3b"
            />
          </svg>
        </div>

        {/* Creme content */}
        <div className="mimo-section-fade" style={{ background: '#f0e6d2' }}>

          {/* Success state */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-8 text-center" style={{ minHeight: '50vh', animation: 'mimo-fade-in 0.5s ease-out' }}>
              <div className="mb-6" style={{ color: '#25D366', animation: 'mimo-scale-in 0.4s ease-out' }}>
                <Check size={80} strokeWidth={1.5} />
              </div>
              <h2 className="font-script mb-4" style={{ fontSize: 48, color: '#2e1008' }}>Pedido enviado!</h2>
              <p className="font-display mb-8" style={{ fontSize: 18, color: '#854d3b' }}>
                Em breve entraremos em contato para confirmar sua doçura.
              </p>
              <button
                onClick={resetAll}
                className="font-display italic transition-colors"
                style={{ color: '#854d3b', borderBottom: '1px solid #854d3b', paddingBottom: 4 }}
              >
                Fazer novo pedido
              </button>
            </div>
          ) : (
            <div className="max-w-lg mx-auto px-5 py-8" style={{ paddingBottom: cartCount > 0 ? 120 : 40 }}>

              {/* Progress indicator */}
              <div className="flex justify-center items-center gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      height: 6,
                      width: step >= i ? 32 : 8,
                      background: step >= i
                        ? 'linear-gradient(90deg, #854d3b, rgba(201,169,110,0.7), #854d3b)'
                        : 'rgba(46,16,8,0.15)',
                      boxShadow: step >= i ? '0 0 8px rgba(201,169,110,0.3)' : 'none',
                    }}
                  />
                ))}
              </div>

              {/* STEP 1 — MENU */}
              {step === 1 && (
                <div style={{ animation: 'mimo-fade-in 0.5s ease-out' }}>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-1">
                      <span className="mimo-gold-dot" />
                      <h3 className="font-display font-semibold mimo-shimmer" style={{ fontSize: 26, color: '#2e1008', letterSpacing: '0.04em' }}>
                        Nossos Mimos
                      </h3>
                      <span className="mimo-gold-dot" />
                    </div>
                    <p className="font-display italic" style={{ fontSize: 14, color: '#a67c5b' }}>escolha seu favorito</p>
                    <div className="mx-auto mt-2 mimo-gold-line" style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)' }} />

                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10 mimo-reveal">
                    {PRODUCTS.map((p) => {
                      const qty = cart[p.id];
                      const discount = getDiscount(p.id, qty);
                      return (
                        <div
                          key={p.id}
                          className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 mimo-reveal mimo-stagger-${PRODUCTS.indexOf(p)}`}
                          style={{
                            borderRadius: 20,
                            background: '#f0e6d2',
                            border: qty > 0 ? '2px solid #854d3b' : '1px solid rgba(133,77,59,0.3)',
                            boxShadow: '0 4px 20px rgba(133,77,59,0.12)',
                          }}
                        >
                          {qty > 0 && (
                            <div className="absolute top-0 left-0 z-10" style={{ clipPath: 'polygon(0 0, 36px 0, 0 36px)' }}>
                              <div className="flex items-start justify-start pl-1 pt-1" style={{ width: 36, height: 36, background: '#854d3b' }}>
                                <Check size={11} strokeWidth={3} color="#f0e6d2" />
                              </div>
                            </div>
                          )}
                          <div className="w-full overflow-hidden" style={{ height: 150, borderRadius: '20px 20px 0 0' }}>
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover select-none pointer-events-none" loading="lazy" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                          </div>
                          <div className="p-3 flex flex-col items-center text-center">
                            <h4 className="font-display font-semibold mb-0.5" style={{ fontSize: 17, color: '#2e1008' }}>{p.name}</h4>
                            <p className="font-body mb-2" style={{ fontSize: 11, fontWeight: 300, color: '#a67c5b', minHeight: 28 }}>
                              {p.descHighlight ? (
                                <>
                                  {p.desc.split(p.descHighlight)[0]}
                                  <span style={{ fontWeight: 700, color: '#854d3b' }}>{p.descHighlight}</span>
                                  {p.desc.split(p.descHighlight)[1]}
                                </>
                              ) : p.desc}
                            </p>
                            <p className="font-display font-bold mb-3" style={{ fontSize: 20, color: '#2e1008' }}>
                              {formatCurrency(qty > 0 ? qty * p.price : p.price)}
                            </p>
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateQty(p.id, -1)} className="flex items-center justify-center rounded-full transition-all mimo-press" style={{ width: 30, height: 30, background: '#f0e6d2', border: '1px solid rgba(133,77,59,0.3)', color: '#2e1008' }}>
                                <Minus size={13} />
                              </button>
                              <span className="font-body font-medium text-center" style={{ fontSize: 15, minWidth: 24, color: '#2e1008' }}>{qty}</span>
                              <button onClick={() => updateQty(p.id, 1)} className="flex items-center justify-center rounded-full transition-all mimo-press" style={{ width: 30, height: 30, background: '#854d3b', color: '#f0e6d2' }}>
                                <Plus size={13} />
                              </button>
                            </div>
                            {discount > 0 && (
                              <div className="mt-2 font-body" style={{ background: 'rgba(133,77,59,0.1)', border: '1px solid rgba(133,77,59,0.25)', color: '#7a3d28', borderRadius: 100, padding: '3px 10px', fontSize: 11, animation: 'mimo-fade-in 0.3s ease-out' }}>
                                R$ {discount} de desconto
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>


                  {/* Combo */}
                  <div className="text-center mb-6 mimo-reveal">
                    <div className="flex items-center justify-center gap-3 mb-1">
                      <span className="mimo-gold-dot" />
                      <h3 className="font-display font-semibold mimo-shimmer" style={{ fontSize: 26, color: '#2e1008', letterSpacing: '0.04em' }}>Combo de Mimo</h3>
                      <span className="mimo-gold-dot" />
                    </div>
                    <p className="font-display italic" style={{ fontSize: 14, color: '#a67c5b' }}>o presente perfeito</p>
                    <div className="mx-auto mt-2 mimo-gold-line" style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)' }} />

                  </div>

                  <div className="relative overflow-hidden transition-all duration-300 mimo-reveal" style={{ borderRadius: 24, background: 'linear-gradient(135deg, #2e1008 0%, #854d3b 100%)', border: '2px solid #854d3b', boxShadow: '0 12px 40px rgba(46,16,8,0.25)' }}>
                    {/* Faixa de desconto */}
                    <div className="absolute top-4 right-0 z-10 font-body font-bold uppercase" style={{ background: '#c0392b', color: '#fff', fontSize: 11, padding: '5px 16px 5px 20px', letterSpacing: '0.08em', clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%)' }}>
                      -10% OFF
                    </div>
                    <div className="w-full overflow-hidden" style={{ height: 180 }}>
                      <img src={COMBO.image} alt={COMBO.name} className="w-full h-full object-cover select-none pointer-events-none" style={{ opacity: 0.85 }} loading="lazy" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                    </div>
                    <div className="p-5 text-center">
                      <h4 className="font-display font-semibold mb-1" style={{ fontSize: 22, color: '#f0e6d2' }}>{COMBO.name}</h4>
                      <p className="font-display italic mb-4" style={{ fontSize: 13, color: 'rgba(240,230,210,0.7)' }}>{COMBO.desc}</p>
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="font-body line-through" style={{ fontSize: 14, color: 'rgba(240,230,210,0.5)' }}>{formatCurrency(COMBO.originalPrice)}</span>
                        <span className="font-display font-bold" style={{ fontSize: 32, color: '#f0e6d2' }}>{formatCurrency(COMBO.price)}</span>
                      </div>
                      <div className="inline-block font-display font-semibold mb-5" style={{ background: 'rgba(240,230,210,0.15)', color: '#f0e6d2', fontSize: 12, padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(240,230,210,0.2)' }}>
                        Você economiza {formatCurrency(COMBO.originalPrice - COMBO.price)}!
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => updateQty("combo", -1)} className="flex items-center justify-center rounded-full transition-all mimo-press" style={{ width: 36, height: 36, background: 'rgba(240,230,210,0.15)', border: '1px solid rgba(240,230,210,0.3)', color: '#f0e6d2' }}><Minus size={16} /></button>
                        <span className="font-body font-semibold" style={{ fontSize: 20, minWidth: 32, textAlign: 'center', color: '#f0e6d2' }}>{cart.combo}</span>
                        <button onClick={() => updateQty("combo", 1)} className="flex items-center justify-center rounded-full transition-all mimo-press" style={{ width: 36, height: 36, background: '#f0e6d2', color: '#854d3b' }}><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>

                  {/* Embalagem Especial */}
                  <div className="flex flex-col items-center text-center mt-16 mb-4 mimo-reveal">
                    {/* Divider top */}
                    <div className="flex items-center gap-3 mb-8">
                      <div className="mimo-gold-line" style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5))' }} />
                      <span className="mimo-gold-dot" />
                      <span className="font-body uppercase mimo-shimmer" style={{ fontSize: 10, letterSpacing: '0.2em', color: '#a67c5b', fontWeight: 600 }}>presente perfeito</span>
                      <span className="mimo-gold-dot" />
                      <div className="mimo-gold-line" style={{ width: 40, height: 1, background: 'linear-gradient(90deg, rgba(201,169,110,0.5), transparent)' }} />
                    </div>

                    {/* Image with glow + shadow */}
                    <div className="relative">
                      <div
                        className="absolute -inset-6 rounded-full animate-pulse"
                        style={{
                          background: 'radial-gradient(circle, rgba(133,77,59,0.15) 0%, transparent 70%)',
                          filter: 'blur(20px)',
                        }}
                      />
                      <img
                        src={embalagemPascoa}
                        alt="Embalagem Especial de Páscoa"
                        className="relative"
                        style={{
                          maxWidth: 300,
                          width: '100%',
                          height: 'auto',
                          filter: 'drop-shadow(0 20px 40px rgba(46,16,8,0.2)) drop-shadow(0 8px 16px rgba(133,77,59,0.15))',
                          animation: 'mimo-fade-in 0.6s ease-out',
                        }}
                      />
                    </div>

                    {/* Text */}
                    <h3 className="font-display font-semibold mt-8 mimo-shimmer" style={{ fontSize: 24, color: '#2e1008', letterSpacing: '0.04em', textShadow: '0 0 16px rgba(201,169,110,0.2)' }}>
                      Embalagem Especial
                    </h3>
                    <p className="font-display italic mt-1" style={{ fontSize: 14, color: '#a67c5b' }}>
                      Edição Páscoa 2026
                    </p>

                    {/* Badge */}
                    <span
                      className="inline-block font-body uppercase mt-4"
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        color: '#f0e6d2',
                        background: '#854d3b',
                        padding: '6px 16px',
                        borderRadius: 100,
                      }}
                    >
                      Inclusa no pedido
                    </span>

                    {/* Divider bottom */}
                    <div className="mt-8 mimo-gold-line" style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)' }} />
                  </div>
                </div>
              )}

              {/* STEP 2 — CART */}
              {step === 2 && (
                <div style={{ animation: 'mimo-fade-in 0.5s ease-out' }}>
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 mb-6 font-display italic transition-colors" style={{ color: '#854d3b' }}>
                    <ArrowLeft size={18} /> Voltar ao cardápio
                  </button>
                  <h3 className="font-script mb-6 mimo-shimmer" style={{ fontSize: 40, color: '#2e1008', textShadow: '0 0 20px rgba(201,169,110,0.2)' }}>Seu pedido</h3>

                  <div className="space-y-3 mb-6">
                    {Object.entries(cart).map(([id, qty]) => {
                      if (qty === 0) return null;
                      const p = id === "combo" ? COMBO : PRODUCTS.find((x) => x.id === id)!;
                      const disc = getDiscount(id, qty);
                      const itemTotal = p.price * qty - disc;
                      return (
                        <div key={id} className="p-4 flex justify-between items-center" style={{ borderRadius: 16, background: '#f0e6d2', border: '1px solid rgba(133,77,59,0.25)', boxShadow: '0 4px 16px rgba(46,16,8,0.06)' }}>
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover" />
                            <div>
                              <p className="font-display font-semibold" style={{ fontSize: 15, color: '#2e1008' }}>{p.name}</p>
                              <p className="font-body" style={{ fontSize: 12, color: '#a67c5b' }}>{qty}x {formatCurrency(p.price)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {disc > 0 && <p className="font-body line-through" style={{ fontSize: 11, color: '#a67c5b' }}>{formatCurrency(p.price * qty)}</p>}
                            <p className="font-display font-semibold" style={{ fontSize: 17, color: '#2e1008' }}>{formatCurrency(itemTotal)}</p>
                            <button onClick={() => updateQty(id, -qty)} className="font-body uppercase tracking-widest" style={{ fontSize: 10, color: '#854d3b' }}>Remover</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-5 mb-6" style={{ borderRadius: 20, background: '#f0e6d2', border: '1px solid rgba(133,77,59,0.25)' }}>
                    <div className="flex justify-between text-sm mb-2 font-body" style={{ color: '#2e1008' }}>
                      <span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {totals.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm mb-3 font-body" style={{ color: '#7a3d28' }}>
                        <span>Descontos</span><span>-{formatCurrency(totals.totalDiscount)}</span>
                      </div>
                    )}
                    <div className="mb-3 mimo-gold-line" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)' }} />
                    <div className="flex justify-between font-display font-bold" style={{ fontSize: 22, color: '#2e1008' }}>
                      <span>Total</span><span>{formatCurrency(totals.total)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input type="text" placeholder="Seu nome" className="w-full border rounded-xl p-4 text-base outline-none transition-all font-body" style={{ background: '#f0e6d2', borderColor: 'rgba(133,77,59,0.3)', color: '#2e1008' }} value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                    <input type="tel" placeholder="Telefone (WhatsApp)" className="w-full border rounded-xl p-4 text-base outline-none transition-all font-body" style={{ background: '#f0e6d2', borderColor: 'rgba(133,77,59,0.3)', color: '#2e1008' }} value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: formatPhone(e.target.value) })} />
                    <textarea placeholder="Observações (opcional)" className="w-full border rounded-xl p-4 text-base outline-none transition-all font-body h-24 resize-none" style={{ background: '#f0e6d2', borderColor: 'rgba(133,77,59,0.3)', color: '#2e1008' }} value={userData.obs} onChange={(e) => setUserData({ ...userData, obs: e.target.value })} />
                  </div>
                </div>
              )}

              {/* STEP 3 — CONFIRMATION */}
              {step === 3 && (
                <div className="text-center" style={{ animation: 'mimo-fade-in 0.5s ease-out' }}>
                  <div className="mb-5 flex justify-center"><Gift size={44} style={{ color: '#854d3b' }} /></div>
                  <h3 className="font-script mb-2 mimo-shimmer" style={{ fontSize: 44, color: '#2e1008', textShadow: '0 0 20px rgba(201,169,110,0.25)' }}>Pedido pronto!</h3>
                  <p className="font-display italic mb-8" style={{ fontSize: 15, color: '#a67c5b' }}>Confira antes de enviar</p>

                  <div className="p-5 text-left mb-8" style={{ background: '#854c3a', color: '#f0e6d2', borderRadius: 20, transform: 'rotate(1deg)', boxShadow: '0 16px 40px rgba(46,16,8,0.3)' }}>
                    <p className="font-body uppercase tracking-wider opacity-50 mb-3" style={{ fontSize: 10 }}>Preview da mensagem:</p>
                    <div className="space-y-1 font-body" style={{ fontSize: 13 }}>
                      <p>Olá! Gostaria de fazer um pedido...</p>
                      {Object.entries(cart).map(([id, qty]) => {
                        if (qty === 0) return null;
                        const p = id === "combo" ? COMBO : PRODUCTS.find((x) => x.id === id)!;
                        return <p key={id}>• {qty}x {p.name} — {formatCurrency(p.price * qty - getDiscount(id, qty))}</p>;
                      })}
                      <p className="mt-2 font-bold">Total: {formatCurrency(totals.total)}</p>
                      <p>Nome: {userData.name}</p>
                    </div>
                  </div>

                  <button onClick={handleSendWhatsApp} className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all" style={{ background: '#25D366', color: '#f0e6d2', fontSize: 15, boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}>
                    <Send size={18} /> Enviar pelo WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </section>

      {/* ════════════════════════════════════════════ */}
      {/* SEÇÃO 3 — SOBRE                             */}
      {/* ════════════════════════════════════════════ */}
      <section id="sobre">

        {/* Section divider with centered "Cookies" */}
        <div className="flex items-center justify-center" style={{ background: '#854c3a', paddingTop: 12, paddingBottom: 24 }}>
          <div className="mimo-gold-line" style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), rgba(240,230,210,0.25))', marginLeft: 32 }} />
          <div className="flex items-center gap-2">
            <span className="mimo-gold-dot" />
            <h2 className="font-display px-3" style={{ fontSize: 22, color: '#f0e6d2', fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', textShadow: '0 0 16px rgba(201,169,110,0.3)' }}>
              Cookies
            </h2>
            <span className="mimo-gold-dot" />
          </div>
          <div className="mimo-gold-line" style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(240,230,210,0.25), rgba(201,169,110,0.5), transparent)', marginRight: 32 }} />
        </div>

        <div style={{ background: '#f0e6d2' }}>
          <div className="max-w-lg mx-auto px-5 py-10">
            <div className="grid grid-cols-2 gap-3 mimo-reveal">
              {[sobreVideo1, sobreVideo2, sobreVideo3, sobreVideo4, sobreVideo5].map((vid, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
                  <video
                    src={vid}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '9/16' }}
                  />
                </div>
              ))}
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
                <img
                  src={sobreImage5}
                  alt="Mimô Cookies embalagem"
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '9/16' }}
                />
              </div>
            </div>
          </div>
        </div>

        

        {/* Footer profissional */}
        <footer style={{ background: '#854c3a', padding: '48px 24px 32px' }}>
          <div className="max-w-lg mx-auto">
            {/* Logo + Nome */}
            <div className="flex flex-col items-center mb-8">
              <div className="rounded-full overflow-hidden mb-3 mimo-gold-glow" style={{ width: 56, height: 56, border: '2px solid rgba(201,169,110,0.4)' }}>
                <img src={logoMimo} alt="Mimô Cookies" className="w-full h-full object-cover" />
              </div>
              <p className="font-script mimo-shimmer" style={{ fontSize: 28, color: '#f0e6d2', textShadow: '0 0 16px rgba(201,169,110,0.3)' }}>Mimô Cookies</p>
              <p className="font-display italic mt-1" style={{ fontSize: 13, color: '#a67c5b' }}>
                Feito com amor, entregue com carinho
              </p>
            </div>

            {/* Divider */}
            <div className="mx-auto mb-6 mimo-gold-line" style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)' }} />

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-center mb-8">
              <div>
                <p className="font-body font-semibold" style={{ fontSize: 11, color: '#f0e6d2', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Localização</p>
                <p className="font-body" style={{ fontSize: 12, color: '#a67c5b' }}>Tijuca, Rio de Janeiro</p>
              </div>
              <div>
                <p className="font-body font-semibold" style={{ fontSize: 11, color: '#f0e6d2', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Pedidos</p>
                <a href="https://wa.me/5521998016799" target="_blank" rel="noopener noreferrer" className="font-body" style={{ fontSize: 12, color: '#a67c5b' }}>
                  WhatsApp (21) 99801-6799
                </a>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-5 mb-8">
              <a href="https://wa.me/5521998016799" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: 'rgba(240,230,210,0.1)' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#f0e6d2"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="https://www.instagram.com/mimo_cookiess/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: 'rgba(240,230,210,0.1)' }}>
                <Instagram size={20} color="#f0e6d2" />
              </a>
            </div>

            {/* Divider */}
            <div className="mx-auto mb-4" style={{ width: '100%', height: 1, background: 'rgba(240,230,210,0.08)' }} />

            {/* Desenvolvido por */}
            <p className="font-body text-center mb-2" style={{ fontSize: 10, color: 'rgba(240,230,210,0.5)', fontWeight: 400 }}>
              Desenvolvido por{' '}
              <a href="https://www.instagram.com/andromedasolucoes" target="_blank" rel="noopener noreferrer" style={{ color: '#f0e6d2', textDecoration: 'underline' }}>
                Andromeda Soluções
              </a>
            </p>

            {/* Copyright */}
            <p className="font-body text-center" style={{ fontSize: 10, color: 'rgba(240,230,210,0.3)', fontWeight: 300 }}>
              © 2026 Mimô Cookies · Todos os direitos reservados
            </p>
          </div>
        </footer>
      </section>

      {/* Floating cart button */}
      {!isSuccess && step < 3 && cartCount > 0 && (
        <div className="fixed z-40" style={{ bottom: 24, left: '50%', width: 'calc(100% - 48px)', maxWidth: 400, animation: 'mimo-slide-up 0.3s ease-out forwards' }}>
          {/* Item count badge */}
          <div
            className="absolute flex items-center justify-center rounded-full font-body font-bold"
            style={{
              top: -8,
              right: -4,
              width: 24,
              height: 24,
              background: '#c0392b',
              color: '#f0e6d2',
              fontSize: 11,
              boxShadow: '0 2px 8px rgba(192,57,43,0.4)',
              zIndex: 1,
            }}
          >
            {cartCount}
          </div>
          <button
            onClick={() => {
              if (step === 1) trackEvent("checkout_started", { cartTotal: totals.total, cartCount });
              setStep((s) => s + 1);
              scrollTo("pedir");
            }}
            disabled={!canProceed}
            className="w-full flex justify-between items-center transition-all"
            style={{ padding: '16px 28px', borderRadius: 100, background: 'linear-gradient(135deg, #854c3a 0%, #854d3b 100%)', boxShadow: '0 10px 32px rgba(46,16,8,0.4)', opacity: canProceed ? 1 : 0.5 }}
          >
            <span className="font-body font-semibold uppercase" style={{ fontSize: 14, letterSpacing: '0.08em', color: '#f0e6d2' }}>
              {step === 1 ? "Ver carrinho" : "Confirmar pedido"}
            </span>
            <span className="font-display font-semibold" style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(240,230,210,0.15)', fontSize: 15, color: '#f0e6d2' }}>
              {formatCurrency(totals.total)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
