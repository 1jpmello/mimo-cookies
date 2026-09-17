interface ProgressIndicatorProps {
  step: number;
}

const ProgressIndicator = ({ step }: ProgressIndicatorProps) => {
  return (
    <div
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: 'rgba(240,230,210,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(122,61,40,0.08)',
      }}
    >
      <div className="flex justify-center items-center gap-4 py-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              height: 6,
              width: step >= i ? 32 : 8,
              background: step >= i ? '#854d3b' : 'rgba(46,16,8,0.1)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
