import partnerConfluent from "@/assets/partner-confluent.jpeg";
import partnerMicrosoft from "@/assets/partner-microsoft.png";
import partnerAws from "@/assets/partner-aws.png";
import partnerGcp from "@/assets/partner-gcp.png";
import partnerAzure from "@/assets/partner-azure.png";
import partnerSnowflake from "@/assets/partner-snowflake.png";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const partners = [
  { name: "Confluent", logo: partnerConfluent },
  { name: "Microsoft", logo: partnerMicrosoft },
  { name: "AWS", logo: partnerAws },
  { name: "Google Cloud", logo: partnerGcp },
  { name: "Microsoft Azure", logo: partnerAzure },
  { name: "Snowflake", logo: partnerSnowflake },
];

export function PharmaPartners() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              Technology partners
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((p, i) => (
            <ScrollReveal key={p.name} delay={i * 80}>
              <div className="flex items-center justify-center h-24 px-4 transition-opacity hover:opacity-70">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-16 max-w-[120px] object-contain"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
