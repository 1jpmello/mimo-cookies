import { ChevronDown } from "lucide-react";
import { scrollTo } from "@/lib/dom";
import HeroParticles from "@/components/mimo/HeroParticles";
import logoMimo from "@/assets/logo-mimo.png";
import heroBg from "@/assets/hero-bg.jpg";
import heroBgDesktop from "@/assets/hero-bg-desktop.jpg";
import produtoVideo from "@/assets/produto-video.mp4";

const NAV_ITEMS = [
  { label: "Início", target: "inicio" },
  { label: "Pedir", target: "pedir" },
  { label: "Cookies", target: "sobre" },
];

const HeroSection = () => (
  <section
    id="inicio"
    className="relative w-full overflow-hidden mimo-hero-section"
    style={{ height: "100dvh", "--hero-bg-desktop": `url(${heroBgDesktop})` } as React.CSSProperties}
  >
    <img
      src={heroBg}
      alt="Mimô Cookies"
      className="absolute inset-0 w-full h-full object-cover mimo-hero-mobile-bg scale-105"
    />
    <div className="mimo-hero-mobile-bg">
      <HeroParticles />
    </div>

    <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center overflow-visible pt-[70px] pb-[60px]">
      <h1
        className="font-script text-center w-full overflow-visible text-[52px] leading-[1.2] mb-2 px-5 pl-[38px]"
        style={{ filter: "drop-shadow(0 0 18px rgba(201,169,110,0.35)) drop-shadow(0 0 36px rgba(201,169,110,0.15))" }}
      >
        <span
          className="mimo-shimmer"
          style={{
            background: "linear-gradient(135deg, hsl(var(--texto)) 0%, hsl(var(--marrom-wave)) 50%, hsl(var(--texto)) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Mimô Cookies
        </span>
      </h1>

      <span className="font-display uppercase text-center mimo-badge-pulse text-[11px] tracking-[0.25em] text-marrom-wave font-semibold mb-7">
        Artesanal
      </span>

      <div className="relative">
        <div
          className="absolute -inset-4 rounded-[24px] animate-pulse"
          style={{ background: "radial-gradient(circle, hsl(var(--marrom-wave) / 0.3) 0%, transparent 70%)", filter: "blur(12px)" }}
        />
        <video
          src={produtoVideo}
          autoPlay
          loop
          muted
          playsInline
          className="relative object-cover w-[200px] h-[250px] rounded-[20px] border-2 border-dourado/30"
          style={{ boxShadow: "0 10px 40px hsl(var(--texto) / 0.25), 0 0 24px hsl(var(--marrom-wave) / 0.15), 0 0 20px hsl(var(--dourado) / 0.12)" }}
        />
        <img
          src={logoMimo}
          alt="Mimô"
          className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full object-cover rotate-[12deg]"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
        />
      </div>

      <p className="font-display text-center mt-7 text-[13px] font-semibold text-marrom-wave tracking-[0.2em] uppercase" style={{ textShadow: "0 1px 6px hsl(var(--marrom-wave) / 0.3), 0 0 16px hsl(var(--dourado) / 0.25)" }}>
        Edição Especial Páscoa
      </p>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo("pedir")}
      >
        <span className="font-display uppercase text-[9px] tracking-[0.3em] text-marrom-wave opacity-60">Deslize</span>
        <div className="flex flex-col items-center" style={{ animation: "mimo-bounce-down 2s ease-in-out infinite" }}>
          <ChevronDown size={18} className="text-marrom-wave opacity-50 -mb-1.5" />
          <ChevronDown size={18} className="text-marrom-wave opacity-35 -mb-1.5" />
          <ChevronDown size={18} className="text-marrom-wave opacity-20" />
        </div>
      </div>
    </div>

    <nav className="absolute top-0 left-0 right-0 flex items-center justify-center gap-12 z-10 pb-3" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          onClick={() => scrollTo(item.target)}
          className="font-display transition-colors text-xl font-semibold text-creme tracking-[0.04em] bg-transparent border-none cursor-pointer"
        >
          {item.label}
        </button>
      ))}
    </nav>
  </section>
);

export default HeroSection;
