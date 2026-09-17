const OrnamentalLine = () => (
  <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="xMidYMid meet" className="block">
    <line x1="0" y1="12" x2="160" y2="12" stroke="#854d3b" strokeWidth="0.8" opacity="0.3" />
    <path d="M175,12 Q185,4 195,12 Q205,20 215,12 Q225,4 235,12" stroke="#854d3b" strokeWidth="0.8" fill="none" opacity="0.5" />
    <line x1="240" y1="12" x2="400" y2="12" stroke="#854d3b" strokeWidth="0.8" opacity="0.3" />
    <circle cx="195" cy="12" r="2" fill="#854d3b" opacity="0.4" />
    <circle cx="215" cy="12" r="2" fill="#854d3b" opacity="0.4" />
  </svg>
);

const SectionDivider = () => (
  <svg width="200" height="20" viewBox="0 0 200 20" className="block mx-auto mb-3">
    <line x1="0" y1="10" x2="80" y2="10" stroke="#854d3b" strokeWidth="0.8" opacity="0.25" />
    <path d="M88,10 L94,4 L100,10 L94,16 Z" fill="#854d3b" opacity="0.3" />
    <line x1="106" y1="10" x2="200" y2="10" stroke="#854d3b" strokeWidth="0.8" opacity="0.25" />
  </svg>
);

const CornerOrnament = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className} style={{ width: 80, height: 80 }}>
    <path d="M0,0 L30,0 M0,0 L0,30" stroke="#854d3b" strokeWidth="1" fill="none" opacity="0.3" />
    <circle cx="8" cy="8" r="2" fill="#854d3b" opacity="0.2" />
    <path d="M15,0 Q20,10 15,20" stroke="#854d3b" strokeWidth="0.8" fill="none" opacity="0.15" />
  </svg>
);

const GrainOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0"
    style={{
      opacity: 0.5,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.06'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '300px 300px',
    }}
  />
);

const PageCorners = () => (
  <>
    <div className="fixed top-0 left-0 pointer-events-none z-0">
      <CornerOrnament />
    </div>
    <div className="fixed top-0 right-0 pointer-events-none z-0" style={{ transform: 'rotate(90deg)' }}>
      <CornerOrnament />
    </div>
    <div className="fixed bottom-0 left-0 pointer-events-none z-0" style={{ transform: 'rotate(-90deg)' }}>
      <CornerOrnament />
    </div>
    <div className="fixed bottom-0 right-0 pointer-events-none z-0" style={{ transform: 'rotate(180deg)' }}>
      <CornerOrnament />
    </div>
  </>
);

export { OrnamentalLine, SectionDivider, CornerOrnament, GrainOverlay, PageCorners };
