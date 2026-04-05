import { ArrowRight } from "lucide-react";

const posts = [
  { title: "Scaling Pharma Operations Without Losing Compliance", time: "9 min", date: "Mars 2025" },
  { title: "FDA Audit Findings: Prevention vs. Reaction", time: "12 min", date: "Février 2025" },
  { title: "Talent Acquisition in Pharma: A Different Game", time: "8 min", date: "Janvier 2025" },
];

export function PharmaResources() {
  return (
    <section id="resources" className="py-28" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            Insights
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: "#0F172A" }}>
            Insights pharma.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 divide-x" style={{ borderColor: "#E2E8F0" }}>
          {posts.map((p) => (
            <div
              key={p.title}
              className="px-8 first:pl-0 last:pr-0 cursor-pointer group"
            >
              <span className="text-xs" style={{ color: "#94A3B8" }}>{p.date} · {p.time} read</span>
              <h4 className="text-base font-bold mt-2 mb-6 leading-snug" style={{ color: "#0F172A" }}>{p.title}</h4>
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#0891B2" }}>
                Lire <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
