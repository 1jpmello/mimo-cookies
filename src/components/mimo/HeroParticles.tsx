const crumbs = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  size: 3 + Math.random() * 3,
  left: 8 + Math.random() * 84,
  top: 10 + Math.random() * 80,
  color: i % 2 === 0 ? "#854d3b" : "#c9a96e",
  opacity: 0.1 + Math.random() * 0.1,
  duration: 6 + Math.random() * 5,
  delay: Math.random() * 5,
  yRange: 6 + Math.random() * 10,
}));

const HeroParticles = () => (
  <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden>
    {crumbs.map((c) => (
      <div
        key={`c${c.id}`}
        className="absolute"
        style={{
          width: c.size,
          height: c.size,
          left: `${c.left}%`,
          top: `${c.top}%`,
          background: c.color,
          opacity: c.opacity,
          borderRadius: '30% 60% 40% 70%',
          animation: `mimo-crumb-drift ${c.duration}s ease-in-out ${c.delay}s infinite`,
          ['--crumb-y' as string]: `${c.yRange}px`,
        }}
      />
    ))}
  </div>
);

export default HeroParticles;
