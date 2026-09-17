interface WavyBorderProps {
  position: 'top' | 'bottom';
}

const WavyBorder = ({ position }: WavyBorderProps) => {
  const color = '#854d3b';

  if (position === 'top') {
    return (
      <div className="w-full relative">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: 40, marginBottom: -1 }}
        >
          <path
            d="M0,60 Q120,0 240,30 Q360,60 480,30 Q600,0 720,30 Q840,60 960,30 Q1080,0 1200,30 Q1320,60 1440,30 V60 Z"
            fill="#f0e6d2"
          />
          <path
            d="M0,60 Q120,0 240,30 Q360,60 480,30 Q600,0 720,30 Q840,60 960,30 Q1080,0 1200,30 Q1320,60 1440,30 V60 Z"
            fill={color}
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height: 40, marginTop: -1 }}
      >
        <path
          d="M0,0 Q120,50 240,25 Q360,0 480,25 Q600,50 720,25 Q840,0 960,25 Q1080,50 1200,25 Q1320,0 1440,25 V0 Z"
          fill="#f0e6d2"
        />
        <path
          d="M0,0 Q120,50 240,25 Q360,0 480,25 Q600,50 720,25 Q840,0 960,25 Q1080,50 1200,25 Q1320,0 1440,25 V0 Z"
          fill={color}
          opacity="0.15"
        />
      </svg>
    </div>
  );
};

export default WavyBorder;
