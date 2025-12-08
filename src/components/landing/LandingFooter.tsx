import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { label: "Flow", path: "/tools/flow" },
    { label: "Brain", path: "/tools/brain" },
    { label: "Support", path: "/tools/support" },
    { label: "HR", path: "/tools/hr" },
    { label: "Compliance", path: "/tools/compliance" },
    { label: "Sales", path: "/tools/sales" },
  ],
  resources: [
    { label: "Documentation", path: "#" },
    { label: "API", path: "#" },
    { label: "Blog", path: "#" },
    { label: "Changelog", path: "#" },
  ],
  company: [
    { label: "À propos", path: "#" },
    { label: "Carrières", path: "#" },
    { label: "Contact", path: "#" },
  ],
  legal: [
    { label: "Confidentialité", path: "#" },
    { label: "CGU", path: "#" },
    { label: "RGPD", path: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border/30 bg-secondary/5">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-[hsl(260_100%_65%)]" />
                <div className="absolute inset-[2px] rounded-[10px] bg-background flex items-center justify-center">
                  <span className="text-lg font-black text-gradient">A</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">AETHER</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              La plateforme d'automatisation IA pour les entreprises qui veulent aller plus vite.
            </p>
            <div className="flex items-center gap-4">
              {["X", "LinkedIn", "GitHub"].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social}
                </a>
              ))}
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
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AETHER AI Suite. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground">
            Conçu en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
