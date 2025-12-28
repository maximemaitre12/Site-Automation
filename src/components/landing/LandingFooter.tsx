import { Link } from "react-router-dom";

const links = {
  company: [
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ],
  resources: [
    { label: "Documentation", path: "/resources/documentation" },
  ],
  legal: [
    { label: "Privacy", path: "/legal/privacy" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="col-span-2 sm:col-span-1 mb-4 sm:mb-0">
            <Link to="/" className="text-lg font-semibold text-foreground">AETHER</Link>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-3">Intelligent automation for enterprise.</p>
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