import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stats = [
  { value: "85%", label: "Reduction", sub: "in manual document processing" },
  { value: "0", label: "Unvalidated", sub: "actions — human-in-the-loop enforced" },
  { value: "4–6w", label: "Deployment", sub: "from audit to production MVP" },
];

export function PharmaStats() {
  return (
    <section className="py-28 md:py-36" style={{ background: "#EAF3F7" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-start gap-8 mb-24">
            <div className="w-16 h-px mt-3 shrink-0" style={{ background: "#0369A1" }} />
            <p className="text-base md:text-[17px] leading-[1.85] max-w-[620px]" style={{ color: "#4a5568" }}>
              Our <strong style={{ color: "#0F172A" }}>AI agents</strong> are designed to integrate directly into your
              <strong style={{ color: "#0F172A" }}> existing systems</strong> — ERP, HRIS, email workflows. Every output is a
              <strong style={{ color: "#0F172A" }}> draft requiring human validation</strong>, deployed on{" "}
              <strong style={{ color: "#0F172A" }}>scalable cloud infrastructure</strong> compliant with pharmaceutical regulations.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 200}>
              <div className="relative pl-6">
                <div className="w-8 h-[3px] mb-6" style={{ background: "#0369A1" }} />
                <div
                  className="font-heading text-[52px] md:text-[64px] lg:text-[72px] font-bold leading-none mb-2"
                  style={{ color: "#0369A1" }}
                >
                  {s.value}
                </div>
                <div className="text-sm font-heading font-bold mb-1" style={{ color: "#0F172A" }}>
                  {s.label}
                </div>
                <div className="text-[13px]" style={{ color: "#6b7c93" }}>
                  {s.sub}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
