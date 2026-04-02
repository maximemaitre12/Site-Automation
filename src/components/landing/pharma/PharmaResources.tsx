import { ArrowRight, FileText, Video } from "lucide-react";

const posts = [
  { title: "Scaling Pharma Operations Without Losing Compliance", time: "9 min", date: "Mars 2025" },
  { title: "FDA Audit Findings: Prevention vs. Reaction", time: "12 min", date: "Février 2025" },
  { title: "Talent Acquisition in Pharma: A Different Game", time: "8 min", date: "Janvier 2025" },
];

const whitepapers = [
  { title: "Compliance Maturity Model for Pharma", pages: "30 pages", desc: "Où êtes-vous sur le compliance journey?" },
  { title: "GMP Implementation Roadmap", pages: "25 pages", desc: "Guide step-by-step avec templates & checklists" },
];

export function PharmaResources() {
  return (
    <section id="resources" className="py-24" style={{ background: "#F9FBFC" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "#1A3A6B" }}>
          Insights pharma
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-lg font-bold mb-6" style={{ color: "#1A3A6B" }}>Articles récents</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {posts.map((p) => (
                <div key={p.title} className="bg-white rounded-lg border p-5 hover:shadow-md transition-shadow cursor-pointer" style={{ borderColor: "#E8EFF8" }}>
                  <div className="text-xs mb-3" style={{ color: "#6B7C8C" }}>{p.date} · {p.time} read</div>
                  <h4 className="text-sm font-bold mb-3" style={{ color: "#1A3A6B" }}>{p.title}</h4>
                  <span className="text-sm font-medium flex items-center gap-1" style={{ color: "#0D8B5E" }}>
                    Lire <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Whitepapers + Webinar */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold mb-4" style={{ color: "#1A3A6B" }}>Whitepapers</h3>
              {whitepapers.map((w) => (
                <div key={w.title} className="bg-white rounded-lg border p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow" style={{ borderColor: "#E8EFF8" }}>
                  <div className="flex items-start gap-3">
                    <FileText className="w-8 h-8 shrink-0" style={{ color: "#1A3A6B" }} />
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "#1A3A6B" }}>{w.title}</h4>
                      <div className="text-xs" style={{ color: "#6B7C8C" }}>{w.pages}</div>
                      <div className="text-xs mt-1" style={{ color: "#4A5568" }}>{w.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border p-4" style={{ borderColor: "#E8EFF8" }}>
              <div className="flex items-start gap-3">
                <Video className="w-8 h-8 shrink-0" style={{ color: "#FF8A45" }} />
                <div>
                  <h4 className="text-sm font-bold" style={{ color: "#1A3A6B" }}>Webinaire</h4>
                  <div className="text-xs" style={{ color: "#6B7C8C" }}>Jeudi 24 avril · 14h00 CET</div>
                  <div className="text-xs mt-1" style={{ color: "#4A5568" }}>"Scaling Your Pharma Operations"</div>
                  <span className="text-xs font-medium mt-2 inline-flex items-center gap-1" style={{ color: "#0D8B5E" }}>
                    S'inscrire <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
