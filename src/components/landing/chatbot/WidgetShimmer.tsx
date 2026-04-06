export function WidgetShimmer() {
  return (
    <div
      className="mt-5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-4 space-y-3"
      style={{ animation: "aetherMsgIn 200ms ease-out both" }}
    >
      <div className="h-3 w-[45%] rounded-full bg-[#E2E8F0]" style={{ animation: "aetherShimmer 1.4s ease-in-out infinite" }} />
      <div className="h-2.5 w-[80%] rounded-full bg-[#E2E8F0]" style={{ animation: "aetherShimmer 1.4s ease-in-out 0.15s infinite" }} />
      <div className="h-2.5 w-[65%] rounded-full bg-[#E2E8F0]" style={{ animation: "aetherShimmer 1.4s ease-in-out 0.3s infinite" }} />
      <div className="h-2.5 w-[50%] rounded-full bg-[#E2E8F0]" style={{ animation: "aetherShimmer 1.4s ease-in-out 0.45s infinite" }} />
    </div>
  );
}
