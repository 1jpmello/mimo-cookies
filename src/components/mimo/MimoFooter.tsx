import { OrnamentalLine } from "./Ornaments";

const MimoFooter = () => {
  return (
    <footer
      className="text-center"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(122,61,40,0.04))',
        padding: '40px 24px 32px',
        borderTop: '1px solid rgba(122,61,40,0.1)',
      }}
    >
      {/* Top ornament */}
      <div className="max-w-[200px] mx-auto mb-6">
        <OrnamentalLine />
      </div>

      {/* Logo */}
      <p className="font-script" style={{ fontSize: 32, color: '#a67c5b' }}>
        Mimô Cookies
      </p>

      {/* Tagline */}
      <p className="font-display italic mt-1.5" style={{ fontSize: 14, color: '#854d3b' }}>
        Feito com amor, entregue com carinho
      </p>

      {/* Info lines */}
      <div className="mt-5 space-y-1.5 font-body" style={{ fontSize: 12, color: '#a67c5b' }}>
        <p>Curitiba, PR</p>
        <p>Pedidos via WhatsApp</p>
        <p>Encomendas com 48h de antecedência</p>
      </div>

      {/* Divider */}
      <div className="my-5" style={{ height: 1, background: 'rgba(122,61,40,0.08)' }} />

      {/* Trust seals */}
      <div className="flex items-center justify-center gap-5 font-body" style={{ fontSize: 10, color: '#a67c5b', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
        <span>Artesanal</span>
        <span>Premium</span>
        <span>Páscoa 2026</span>
      </div>

      {/* Copyright */}
      <p className="font-body mt-4" style={{ fontSize: 10, color: '#a67c5b', fontWeight: 300, opacity: 0.6 }}>
        © 2026 Mimô Cookies · Todos os direitos reservados
      </p>
    </footer>
  );
};

export default MimoFooter;
