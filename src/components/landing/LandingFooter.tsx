import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col items-center text-center gap-6">
          <div>
            <Link to="/" className="text-xl font-semibold text-foreground">AETHER</Link>
            <p className="text-sm text-muted-foreground mt-1">Conseil en performance supply chain.</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            {EMAILS.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                {email}
              </a>
            ))}
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Confidentialité</Link>
            <Link to="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mentions légales</Link>
          </nav>
          
          <p className="text-xs text-muted-foreground pt-4 border-t border-border w-full">
            © {new Date().getFullYear()} AETHER. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
