import embalagemPascoa from "@/assets/embalagem-pascoa.png";

const SpecialPackaging = () => (
  <div className="flex flex-col items-center text-center mt-16 mb-4 mimo-reveal">
    <div className="flex items-center gap-3 mb-8">
      <div className="mimo-gold-line w-10" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.5))" }} />
      <span className="mimo-gold-dot" />
      <span className="font-body uppercase mimo-shimmer text-[10px] tracking-[0.2em] text-suave font-semibold">presente perfeito</span>
      <span className="mimo-gold-dot" />
      <div className="mimo-gold-line w-10" style={{ height: 1, background: "linear-gradient(90deg, rgba(201,169,110,0.5), transparent)" }} />
    </div>

    <div className="relative">
      <div
        className="absolute -inset-6 rounded-full animate-pulse"
        style={{ background: "radial-gradient(circle, hsl(var(--marrom-wave) / 0.15) 0%, transparent 70%)", filter: "blur(20px)" }}
      />
      <img
        src={embalagemPascoa}
        alt="Embalagem Especial de Páscoa"
        className="relative max-w-[300px] w-full h-auto animate-mimo-fade-in"
        style={{ filter: "drop-shadow(0 20px 40px hsl(var(--texto) / 0.2)) drop-shadow(0 8px 16px hsl(var(--marrom-wave) / 0.15))" }}
      />
    </div>

    <h3 className="font-display font-semibold mt-8 mimo-shimmer text-2xl tracking-[0.04em] text-texto" style={{ textShadow: "0 0 16px rgba(201,169,110,0.2)" }}>
      Embalagem Especial
    </h3>
    <p className="font-display italic mt-1 text-sm text-suave">Edição Páscoa 2026</p>

    <span className="inline-block font-body uppercase mt-4 text-[10px] tracking-[0.15em] font-semibold text-creme bg-marrom-wave px-4 py-1.5 rounded-full">
      Inclusa no pedido
    </span>

    <div className="mt-8 mimo-gold-line w-[60px]" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)" }} />
  </div>
);

export default SpecialPackaging;
