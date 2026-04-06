export function WidgetShimmer() {
  return (
    <div
      className="mt-4 first:mt-0 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/80 p-4 overflow-hidden relative"
      style={{ animation: "aetherWidgetIn 280ms ease-out both" }}
    >
      {/* Shimmer sweep overlay */}
      <div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
          animation: "aetherSweep 1.8s ease-in-out infinite",
        }}
      />

      {/* Skeleton lines */}
      <div className="space-y-3 relative">
        <div
          className="h-[10px] w-[40%] rounded-full bg-[#E2E8F0]"
          style={{ animation: "aetherShimmer 1.4s ease-in-out infinite" }}
        />
        <div
          className="h-[8px] w-[75%] rounded-full bg-[#E2E8F0]/70"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.12s infinite" }}
        />
        <div
          className="h-[8px] w-[60%] rounded-full bg-[#E2E8F0]/70"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.24s infinite" }}
        />
        <div
          className="h-[8px] w-[45%] rounded-full bg-[#E2E8F0]/50"
          style={{ animation: "aetherShimmer 1.4s ease-in-out 0.36s infinite" }}
        />
      </div>
    </div>
  );
}
