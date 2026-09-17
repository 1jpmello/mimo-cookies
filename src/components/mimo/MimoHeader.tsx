import logoMimo from "@/assets/logo-mimo.png";
import headerBg from "@/assets/header-bg.jpg";
import headerBgMobile from "@/assets/header-bg-mobile.jpg";
import { OrnamentalLine } from "./Ornaments";
import { useIsMobile } from "@/hooks/use-mobile";

const MimoHeader = () => {
  const isMobile = useIsMobile();

  return (
    <header
      className="text-center relative"
      style={{
        minHeight: 380,
        backgroundImage: `url(${isMobile ? headerBgMobile : headerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingBottom: 16,
      }}
    >
      {/* Top ornamental border */}
      <div className="px-6 pt-4">
        <OrnamentalLine />
      </div>

      {/* Badge */}
      <p
        className="font-body uppercase mt-7 mb-4"
        style={{ fontSize: 11, letterSpacing: '0.3em', color: '#854d3b' }}
      >
        Edição Especial de Páscoa
      </p>

      {/* Logo circular */}
      <div className="relative mx-auto" style={{ width: 116, height: 116 }}>
        {/* Outer dashed ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px dashed rgba(122,61,40,0.15)' }}
        />
        {/* Inner circle */}
        <div
          className="absolute rounded-full overflow-hidden flex items-center justify-center"
          style={{
            top: 8, left: 8, width: 100, height: 100,
            border: '2px solid rgba(122,61,40,0.2)',
            background: 'radial-gradient(circle, #f0e6d2, #f0e6d2)',
            boxShadow: '0 8px 32px rgba(122,61,40,0.12)',
          }}
        >
          <img src={logoMimo} alt="Mimô Cookies" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Brand name */}
      <h1
        className="font-script mt-3"
        style={{ fontSize: 92, lineHeight: 1, color: '#2e1008', textShadow: '0 2px 12px rgba(46,16,8,0.15)', letterSpacing: '0.02em' }}
      >
        Mimô Cookies
      </h1>

      {/* Subtitle with ornament lines */}
      <div className="flex items-center justify-center gap-3 mt-3 px-6">
        <span style={{ width: 40, height: 1, background: 'rgba(133,77,59,0.4)' }} className="block" />
        <p className="font-display italic" style={{ fontSize: 15, color: '#854d3b' }}>
          Cardápio de Páscoa · Edição Especial
        </p>
        <span style={{ width: 40, height: 1, background: 'rgba(133,77,59,0.4)' }} className="block" />
      </div>

      {/* Attribute pills */}
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap px-6">
        {["Artesanal", "Presente especial", "Edição Páscoa"].map((text) => (
          <span
            key={text}
            className="font-body"
            style={{
              padding: '6px 14px',
              border: '1px solid rgba(122,61,40,0.15)',
              borderRadius: 100,
              fontSize: 11,
              color: '#a67c5b',
              background: 'rgba(122,61,40,0.04)',
            }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* Bottom ornamental border */}
      <div className="px-6 mt-6">
        <OrnamentalLine />
      </div>
    </header>
  );
};

export default MimoHeader;
