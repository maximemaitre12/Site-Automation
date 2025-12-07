import { Zap, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { label: "Aether Flow", path: "/tools/flow" },
    { label: "Aether Doc", path: "/tools/brain" },
    { label: "Aether Agents", path: "/tools/flow" },
    { label: "Intégrations", path: "#" },
    { label: "Tarifs", path: "#" },
  ],
  resources: [
    { label: "Documentation", path: "#" },
    { label: "API Reference", path: "#" },
    { label: "Guides", path: "#" },
    { label: "Blog", path: "#" },
    { label: "Changelog", path: "#" },
  ],
  company: [
    { label: "À propos", path: "#" },
    { label: "Carrières", path: "#" },
    { label: "Contact", path: "#" },
    { label: "Partenaires", path: "#" },
  ],
  legal: [
    { label: "Confidentialité", path: "#" },
    { label: "CGU", path: "#" },
    { label: "Sécurité", path: "#" },
    { label: "RGPD", path: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">AETHER</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Automatisez vos opérations avec l'IA. La plateforme d'automatisation intelligente pour les entreprises modernes.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Ressources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 AETHER AI Suite. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground">
            Automatisez tout. Libérez votre potentiel.
          </p>
        </div>
      </div>
    </footer>
  );
}
