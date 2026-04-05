import { useState, useEffect } from "react";

const PHASES = [
  "Analyzing context",
  "Structuring response",
];

export function ThinkingIndicator() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-start"
      style={{ animation: "aetherMsgIn 180ms ease-out" }}
    >
      <div className="px-4 py-3 rounded-[18px] rounded-bl-[6px] bg-[#F8FAFC] border border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <span
            className="text-[12.5px] text-[#64748B] font-medium"
            style={{ animation: "aetherPulse 2s ease-in-out infinite" }}
          >
            {PHASES[phase]}…
          </span>
        </div>
        {/* Ultra-thin progress line */}
        <div className="mt-2 h-[1px] w-24 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0369A1]/20 rounded-full"
            style={{ animation: "aetherProgress 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
