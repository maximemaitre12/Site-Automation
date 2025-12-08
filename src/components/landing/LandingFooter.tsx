import { Link } from "react-router-dom";

const links = {
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
  ],
  company: [
    { label: "À propos", path: "#" },
    { label: "Carrières", path: "#" },
    { label: "Contact", path: "#" },
  ],
  legal: [
    { label: "Confidentialité", path: "#" },
    { label: "CGU", path: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-[hsl(280_100%_60%)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="font-semibold text-foreground">AETHER</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Automatisation IA pour les entreprises modernes.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Produit</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Ressources</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Entreprise</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Légal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AETHER. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
