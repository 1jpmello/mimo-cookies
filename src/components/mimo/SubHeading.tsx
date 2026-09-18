interface SubHeadingProps {
  title: string;
  subtitle: string;
}

/** Título de subseção (dentro da Etapa 1: "Nossos Mimos" / "Combo de Mimo") com pontos dourados e linha divisória abaixo. */
const SubHeading = ({ title, subtitle }: SubHeadingProps) => (
  <div className="text-center mb-6">
    <div className="flex items-center justify-center gap-3 mb-1">
      <span className="mimo-gold-dot" />
      <h3 className="font-display font-semibold mimo-shimmer text-[26px] tracking-[0.04em] text-texto">{title}</h3>
      <span className="mimo-gold-dot" />
    </div>
    <p className="font-display italic text-sm text-suave">{subtitle}</p>
    <div
      className="mx-auto mt-2 mimo-gold-line w-[60px]"
      style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)" }}
    />
  </div>
);

export default SubHeading;
