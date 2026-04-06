export function ThinkingIndicator() {
  return (
    <div
      className="shrink-0 px-5 py-2 pointer-events-none"
      style={{ animation: "aetherMsgIn 150ms ease-out" }}
    >
      <div
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <span
          className="w-[5px] h-[5px] rounded-full bg-[#38BDF8]"
          style={{ animation: "aetherDot 1.4s ease-in-out infinite" }}
        />
        <span
          className="text-[12px] font-medium text-white/90 tracking-wide"
          style={{ animation: "aetherPulse 2s ease-in-out infinite" }}
        >
          Analyzing…
        </span>
      </div>
    </div>
  );
}
