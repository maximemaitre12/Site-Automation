import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer style={{ background: "#FAFBFC", borderTop: "1px solid #E8EFF8" }}>
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="font-heading text-lg font-bold" style={{ color: "#0033CC" }}>AETHER CONNECT</Link>
            <p className="text-sm mt-2 mb-4" style={{ color: "#4A4A4A" }}>
              Digitalisez votre pharma avec l'automatisation IA.
            </p>
            <div className="flex gap-3">
              <a href="#" style={{ color: "#6B7C8C" }}><Linkedin className="w-5 h-5" /></a>
              <a href="#" style={{ color: "#6B7C8C" }}><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#0033CC" }}>Expertise</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#2C3E50" }}>
              <li><a href="#problems" className="hover:opacity-70">RH & Recrutement</a></li>
              <li><a href="#problems" className="hover:opacity-70">Supply Chain</a></li>
              <li><a href="#problems" className="hover:opacity-70">Compliance & Regulatory</a></li>
              <li><a href="#problems" className="hover:opacity-70">Data Analytics</a></li>
            </ul>
            <h4 className="font-heading text-sm font-bold mt-5 mb-3" style={{ color: "#0033CC" }}>Services</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#2C3E50" }}>
              <li><Link to="/contact" className="hover:opacity-70">Audit Gratuit</Link></li>
              <li><a href="#methodology" className="hover:opacity-70">Implémentation</a></li>
              <li><a href="#methodology" className="hover:opacity-70">Support & Scaling</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#0033CC" }}>Ressources</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#2C3E50" }}>
              <li><a href="#faq" className="hover:opacity-70">FAQ</a></li>
              <li><Link to="/blog" className="hover:opacity-70">Blog</Link></li>
              <li><a href="#case-study" className="hover:opacity-70">Cas d'étude</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-3" style={{ color: "#0033CC" }}>Contact</h4>
            <a href="mailto:hello@aether-connect.com" className="flex items-center gap-2 text-sm mb-2" style={{ color: "#2C3E50" }}>
              <Mail className="w-4 h-4" /> hello@aether-connect.com
            </a>
            <p className="text-xs mt-3" style={{ color: "#6B7C8C" }}>Lun-Ven: 9h-18h (CET)</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid #E8EFF8" }}>
          <p className="text-xs" style={{ color: "#6B7C8C" }}>© {new Date().getFullYear()} Aether Connect. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs" style={{ color: "#6B7C8C" }}>
            <Link to="/legal/privacy" className="hover:opacity-70">Privacy Policy</Link>
            <Link to="/legal/terms" className="hover:opacity-70">Terms of Service</Link>
            <Link to="/legal/security" className="hover:opacity-70">Security</Link>
          </div>
          <div className="flex gap-3 text-xs" style={{ color: "#6B7C8C" }}>
            <span>🔐 ISO 27001</span>
            <span>🏥 21 CFR Part 11</span>
            <span>☁️ SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
