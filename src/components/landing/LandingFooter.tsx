import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const allLinks = [
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
  { label: "Docs", path: "/resources/documentation" },
  { label: "Privacy", path: "/legal/privacy" },
];

const EMAIL = "maxime.maitre@edu.em-lyon.com";

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Logo & tagline */}
          <div>
            <Link to="/" className="text-xl font-semibold text-foreground">AETHER</Link>
            <p className="text-sm text-muted-foreground mt-1">Intelligent automation for enterprise.</p>
          </div>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4" />
            {EMAIL}
          </a>
          
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {allLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.path} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground pt-4 border-t border-border w-full">
            © {new Date().getFullYear()} AETHER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
