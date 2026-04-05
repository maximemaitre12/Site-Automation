import { ArrowRight, FileText, Video } from "lucide-react";

const posts = [
  { title: "Scaling Pharma Operations Without Losing Compliance", time: "9 min", date: "Mars 2025" },
  { title: "FDA Audit Findings: Prevention vs. Reaction", time: "12 min", date: "Février 2025" },
  { title: "Talent Acquisition in Pharma: A Different Game", time: "8 min", date: "Janvier 2025" },
];

export function PharmaResources() {
  return (
    <section id="resources" className="py-24" style={{ background: "#FAFCFE" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6" style={{ color: "#0F172A" }}>
            Insights <span style={{ color: "#0891B2" }}>pharma</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 bg-white transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "#E0F2FE" }}>
                <FileText className="w-5 h-5" style={{ color: "#0891B2" }} />
              </div>
              <div className="text-xs mb-3" style={{ color: "#94A3B8" }}>{p.date} · {p.time} read</div>
              <h4 className="text-base font-bold mb-4 leading-snug" style={{ color: "#0F172A" }}>{p.title}</h4>
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#0891B2" }}>
                Lire <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
