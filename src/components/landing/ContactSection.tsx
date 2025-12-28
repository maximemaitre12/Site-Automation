import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function ContactSection() {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-violet-500/10 to-primary/5 border border-primary/20 p-8 md:p-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Icon */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Have Questions?
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg">
                We'd love to hear from you. Whether it's about features, pricing, or a custom solution for your team.
              </p>
            </div>
            
            {/* CTA */}
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-lg hover:scale-[1.02] group shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}