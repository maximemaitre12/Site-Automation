export function WidgetShimmer() {
  return (
    <div
      className="mt-4 first:mt-0 rounded-xl overflow-hidden relative"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 100%)",
        border: "1px solid rgba(226,232,240,0.5)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(3,105,161,0.015)",
        padding: "14px 16px",
        animation: "aetherWidgetIn 300ms ease-out both",
      }}
    >
      {/* Sweep overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          animation: "aetherSweep 2s ease-in-out infinite",
          transform: "translateX(-100%)",
        }}
      />

      {/* Skeleton */}
      <div className="space-y-3.5 relative">
        {/* Header skeleton with accent bar */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-[3px] h-[14px] rounded-full"
            style={{
              background: "linear-gradient(180deg, #CBD5E1 0%, #E2E8F0 100%)",
              animation: "aetherShimmer 1.4s ease-in-out infinite",
            }}
          />
          <div
            className="h-[8px] w-[38%] rounded-full"
            style={{
              background: "linear-gradient(90deg, #E2E8F0, #CBD5E1)",
              animation: "aetherShimmer 1.4s ease-in-out infinite",
            }}
          />
        </div>
        {/* Content lines */}
        <div
          className="h-[7px] w-[75%] rounded-full bg-[#E2E8F0]/60"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.1s infinite" }}
        />
        <div
          className="h-[7px] w-[60%] rounded-full bg-[#E2E8F0]/50"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.2s infinite" }}
        />
        <div
          className="h-[7px] w-[44%] rounded-full bg-[#E2E8F0]/40"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.3s infinite" }}
        />
      </div>
    </div>
  );
}
