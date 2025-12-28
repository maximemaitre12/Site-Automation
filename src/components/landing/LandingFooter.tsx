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
    { label: "About", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ],
  resources: [
    { label: "Documentation", path: "/resources/documentation" },
    { label: "API", path: "/resources/api" },
    { label: "Status", path: "/resources/status" },
  ],
  legal: [
    { label: "Privacy", path: "/legal/privacy" },
    { label: "Terms", path: "/legal/terms" },
    { label: "Security", path: "/legal/security" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="col-span-2 sm:col-span-3 md:col-span-1 mb-4 md:mb-0">
            <Link to="/" className="text-lg font-semibold text-foreground">AETHER</Link>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-3">Intelligent automation for enterprise.</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Products</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AETHER. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}