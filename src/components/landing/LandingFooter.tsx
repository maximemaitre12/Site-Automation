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
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] flex items-center justify-center">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="text-lg font-bold text-background">AETHER</span>
            </Link>
            <p className="text-sm text-background/60">
              La plateforme d'automatisation IA pour entreprises modernes.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold text-background mb-4">Produit</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-background mb-4">Ressources</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">Entreprise</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-background mb-4">Légal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} AETHER. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-sm text-background/60 hover:text-background transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
