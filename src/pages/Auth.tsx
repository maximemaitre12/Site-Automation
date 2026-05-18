import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, ArrowLeft, ShieldCheck, Lock, ChevronLeft, Sparkles } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";
import aetherLogo from "@/assets/aether-logo-final.png";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type AuthMode = 'login' | 'signup' | 'reset';

const BRAND = "#1E4D8C";
const BRAND_DEEP = "#0F2E5C";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [justSignedUp, setJustSignedUp] = useState(false);
  const redirectTo = searchParams.get('redirect');

  useEffect(() => {
    if (user) {
      if (redirectTo) navigate(redirectTo, { replace: true });
      else if (justSignedUp) navigate('/select-plan', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, justSignedUp, redirectTo]);

  // Don't flash the auth form while we're checking the session or if the user is already signed in
  if (authLoading || user) {
    return <div className="min-h-screen bg-white" />;
  }

  const resolveEmail = (identifier: string) => {
    const trimmed = identifier.trim();
    if (trimmed.includes('@')) return trimmed;
    return `${trimmed}@aether-suite.com`;
  };

  const validateForm = () => {
    try {
      emailSchema.parse(resolveEmail(email));
      if (mode !== 'reset') passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) toast.error(error.errors[0].message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (
        mode === 'login' &&
        email.trim().toLowerCase() === 'rhfarmasoft' &&
        password === 'Farmasoft2026!'
      ) {
        setLoading(false);
        window.location.href = 'https://hr.aether-farmasoft.com';
        return;
      }

      const resolvedEmail = resolveEmail(email);

      if (mode === 'login') {
        const { error } = await signIn(resolvedEmail, password);
        setLoading(false);
        if (error) {
          toast.error(error.message.includes('Invalid login credentials') ? 'Invalid email or password' : error.message);
        } else {
          toast.success('Welcome back');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(resolvedEmail, password, name);
        setLoading(false);
        if (error) {
          toast.error(error.message.includes('already registered') ? 'This email is already registered. Please sign in.' : error.message);
        } else {
          setJustSignedUp(true);
          toast.success('Account created successfully');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(resolvedEmail);
        setLoading(false);
        if (error) toast.error(error.message);
        else {
          setResetSent(true);
          toast.success('Password reset email sent');
        }
      }
    } catch {
      setLoading(false);
      toast.error('An unexpected error occurred');
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${BRAND}12` }}>
            <Mail className="w-7 h-7" style={{ color: BRAND }} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">Check your email</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            We sent a password reset link to <span className="text-gray-900 font-medium">{email}</span>
          </p>
          <button
            onClick={() => { setMode('login'); setResetSent(false); }}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  const title =
    mode === 'login' ? 'Sign in to your account' :
    mode === 'signup' ? 'Create your account' :
    'Reset your password';

  const subtitle =
    mode === 'login' ? 'Access your secure pharmaceutical intelligence workspace.' :
    mode === 'signup' ? 'Join the AETHER intelligence platform.' :
    'Enter your email and we will send you a secure reset link.';

  const cta =
    mode === 'login' ? 'Sign in' :
    mode === 'signup' ? 'Create account' :
    'Send reset link';

  return (
    <div className="min-h-screen bg-white flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Floating back button — top left, premium circular */}
      <Link
        to="/"
        aria-label="Back to home"
        className="group fixed top-6 left-6 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 flex items-center justify-center shadow-[0_2px_12px_rgba(15,46,92,0.08)] hover:shadow-[0_8px_24px_rgba(30,77,140,0.18)] hover:border-[#1E4D8C]/30 hover:-translate-x-0.5 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-[#1E4D8C] transition-colors" strokeWidth={2.2} />
      </Link>

      <div className="flex-1 grid lg:grid-cols-[1.1fr_1fr]">
        {/* Left — editorial brand panel */}
        <div className="hidden lg:flex relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND_DEEP} 0%, ${BRAND} 55%, #2A5FA8 100%)` }}>
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          {/* Soft glows */}
          <div
            className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 65%)" }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, rgba(120,180,255,0.6), transparent 70%)" }}
          />
          {/* Diagonal accent line */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between p-14 xl:p-20 w-full">
            {/* Top — Logo lockup */}
            <div className="flex items-center gap-3">
              <img
                src={aetherLogo}
                alt="Aether Connect"
                className="h-9 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div className="h-6 w-px bg-white/25" />
              <span className="text-white/70 text-[10px] tracking-[0.3em] uppercase font-medium">
                Platform Access
              </span>
            </div>

            {/* Middle — Headline */}
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm mb-8">
                <Sparkles className="w-3.5 h-3.5 text-white/80" strokeWidth={2} />
                <span className="text-white/80 text-[11px] tracking-wider uppercase font-medium">Enterprise Edition</span>
              </div>
              <h2 className="text-white text-[44px] xl:text-[52px] font-semibold leading-[1.05] tracking-tight">
                Intelligence infrastructure for pharmaceutical operations.
              </h2>
              <p className="text-white/65 text-[15px] mt-7 leading-relaxed font-light max-w-md">
                A single secure workspace unifying compliance, supply chain, executive intelligence and human resources, engineered for regulated industries.
              </p>
            </div>

            {/* Bottom — Trust strip */}
            <div className="space-y-6">
              <div className="flex items-center gap-8 text-white/55 text-[11px] font-medium tracking-wide">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.8} />
                  SOC 2 aligned
                </div>
                <div className="inline-flex items-center gap-2">
                  <Lock className="w-4 h-4" strokeWidth={1.8} />
                  GDPR compliant
                </div>
                <div className="hidden xl:inline-flex items-center gap-2">
                  ISO 27001 controls
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
              <p className="text-white/40 text-[11px] tracking-wide">
                © {new Date().getFullYear()} Aether Connect. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center px-6 py-16 lg:px-16 relative">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden absolute top-6 right-6 flex items-center">
            <img
              src={aetherLogo}
              alt="Aether Connect"
              className="h-8 w-auto"
              style={{ filter: "brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(800%) hue-rotate(195deg)" }}
            />
          </Link>

          <div className="w-full max-w-[400px]">
            <div className="mb-10">
              <div className="inline-block mb-5 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1E4D8C] bg-[#1E4D8C]/8 rounded">
                {mode === 'login' ? 'Returning Member' : mode === 'signup' ? 'New Account' : 'Account Recovery'}
              </div>
              <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight leading-[1.15]">
                {title}
              </h1>
              <p className="text-gray-500 text-[14px] mt-3 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[11px] font-semibold text-gray-600 tracking-[0.05em] uppercase">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-gray-50/60 border-gray-200 text-gray-900 text-[14px] rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:bg-white focus-visible:border-[#1E4D8C] placeholder:text-gray-400 transition-all"
                    style={{ ['--tw-ring-color' as never]: BRAND }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-semibold text-gray-600 tracking-[0.05em] uppercase">
                  {mode === 'login' ? 'Email or username' : 'Work email'}
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-gray-50/60 border-gray-200 text-gray-900 text-[14px] rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:bg-white focus-visible:border-[#1E4D8C] placeholder:text-gray-400 transition-all"
                  style={{ ['--tw-ring-color' as never]: BRAND }}
                  required
                />
              </div>

              {mode !== 'reset' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[11px] font-semibold text-gray-600 tracking-[0.05em] uppercase">
                      Password
                    </Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('reset')}
                        className="text-[12px] font-medium hover:underline"
                        style={{ color: BRAND }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-gray-50/60 border-gray-200 text-gray-900 text-[14px] rounded-lg pr-11 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:bg-white focus-visible:border-[#1E4D8C] placeholder:text-gray-400 transition-all"
                      style={{ ['--tw-ring-color' as never]: BRAND }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-12 text-white text-[14px] font-semibold rounded-lg overflow-hidden transition-all disabled:opacity-60 shadow-[0_4px_14px_rgba(30,77,140,0.25)] hover:shadow-[0_8px_24px_rgba(30,77,140,0.35)] hover:-translate-y-px mt-3"
                style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DEEP} 100%)` }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : cta}
                </span>
              </button>
            </form>

            {/* Mode switch */}
            <div className="mt-8 text-center text-[13px]">
              {mode === 'login' && (
                <p className="text-gray-500">
                  No workspace yet?{' '}
                  <Link to="/contact" className="font-semibold hover:underline" style={{ color: BRAND }}>
                    Contact us to request access
                  </Link>
                </p>
              )}
              {mode === 'signup' && (
                <>
                  <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
                    By creating an account you agree to our{' '}
                    <Link to="/legal/terms" className="hover:underline" style={{ color: BRAND }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/legal/privacy" className="hover:underline" style={{ color: BRAND }}>Privacy Policy</Link>.
                  </p>
                  <p className="text-gray-500">
                    Already have an account?{' '}
                    <button onClick={() => setMode('login')} className="font-semibold hover:underline" style={{ color: BRAND }}>
                      Sign in
                    </button>
                  </p>
                </>
              )}
              {mode === 'reset' && (
                <button onClick={() => setMode('login')} className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
