interface SectionBannerProps {
  title: string;
  font?: "script" | "display";
  paddingTop?: number;
  paddingBottom?: number;
}

/** Divisor de seção com o título centralizado entre duas linhas douradas — usado em cada troca de seção da página. */
const SectionBanner = ({ title, font = "script", paddingTop = 24, paddingBottom = 16 }: SectionBannerProps) => (
  <div className="flex items-center justify-center bg-marrom-wave" style={{ paddingTop, paddingBottom }}>
    <div
      className="mimo-gold-line flex-1 ml-8"
      style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.5), rgba(240,230,210,0.25))" }}
    />
    <div className="flex items-center gap-2">
      <span className="mimo-gold-dot" />
      <h2
        className={`px-3 mimo-shimmer text-creme ${
          font === "script" ? "font-script text-[32px] tracking-wide" : "font-display text-[22px] font-semibold tracking-[0.08em] whitespace-nowrap"
        }`}
        style={{ textShadow: font === "display" ? "0 0 16px rgba(201,169,110,0.3)" : undefined }}
      >
        {title}
      </h2>
      <span className="mimo-gold-dot" />
    </div>
    <div
      className="mimo-gold-line flex-1 mr-8"
      style={{ height: 1, background: "linear-gradient(90deg, rgba(240,230,210,0.25), rgba(201,169,110,0.5), transparent)" }}
    />
  </div>
);

export default SectionBanner;
