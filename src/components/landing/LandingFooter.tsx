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
  company: [
    { label: "À propos", path: "#" },
    { label: "Carrières", path: "#" },
    { label: "Blog", path: "#" },
    { label: "Contact", path: "#" },
  ],
  resources: [
    { label: "Documentation", path: "#" },
    { label: "API", path: "#" },
    { label: "Statut", path: "#" },
  ],
  legal: [
    { label: "Confidentialité", path: "#" },
    { label: "Conditions", path: "#" },
    { label: "Sécurité", path: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-lg font-semibold text-foreground">
              AETHER
            </Link>
            <p className="text-sm text-muted-foreground mt-3">
              Automatisation intelligente pour l'entreprise.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Produit</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
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
            <h4 className="text-sm font-medium text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
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
            <h4 className="text-sm font-medium text-foreground mb-4">Ressources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
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
            <h4 className="text-sm font-medium text-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AETHER. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
