export function WidgetShimmer() {
  return (
    <div
      className="mt-3 first:mt-0 rounded-xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.6) 100%)",
        border: "1px solid #EFF3F8",
        padding: "16px",
        animation: "aetherWidgetIn 300ms ease-out both",
      }}
    >
      {/* Sweep overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          animation: "aetherSweep 2s ease-in-out infinite",
          transform: "translateX(-100%)",
        }}
      />

      {/* Skeleton */}
      <div className="space-y-3 relative">
        <div className="flex items-center gap-2">
          <div
            className="w-[3px] h-[12px] rounded-full"
            style={{
              background: "linear-gradient(180deg, #CBD5E1 0%, #E2E8F0 100%)",
              animation: "aetherShimmer 1.4s ease-in-out infinite",
            }}
          />
          <div
            className="h-[8px] w-[35%] rounded-full bg-[#E2E8F0]"
            style={{ animation: "aetherShimmer 1.4s ease-in-out infinite" }}
          />
        </div>
        <div
          className="h-[7px] w-[72%] rounded-full bg-[#E2E8F0]/60"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.1s infinite" }}
        />
        <div
          className="h-[7px] w-[58%] rounded-full bg-[#E2E8F0]/50"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.2s infinite" }}
        />
        <div
          className="h-[7px] w-[42%] rounded-full bg-[#E2E8F0]/40"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.3s infinite" }}
        />
      </div>
    </div>
  );
}
