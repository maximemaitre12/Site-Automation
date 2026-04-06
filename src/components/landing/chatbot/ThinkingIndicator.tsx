export function ThinkingIndicator() {
  return (
    <div
      className="shrink-0 px-5 py-2.5 pointer-events-none"
      style={{ animation: "aetherMsgIn 180ms ease-out" }}
    >
      <div
        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
        }}
      >
        {/* Animated dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[4px] h-[4px] rounded-full"
              style={{
                background: "#0369A1",
                animation: `aetherDot 1.4s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
        <span
          className="text-[11px] font-medium tracking-[0.04em]"
          style={{
            color: "rgba(255,255,255,0.85)",
            animation: "aetherPulse 2s ease-in-out infinite",
          }}
        >
          Analyzing
        </span>
      </div>
    </div>
  );
}
