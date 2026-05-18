import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";
import aetherLogo from "@/assets/aether-logo-final.png";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type AuthMode = 'login' | 'signup' | 'reset';

const BRAND = "#1E4D8C";

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

  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  const [justSignedUp, setJustSignedUp] = useState(false);
  const redirectTo = searchParams.get('redirect');

  useEffect(() => {
    if (user) {
      if (redirectTo) navigate(redirectTo);
      else if (justSignedUp) navigate('/select-plan');
      else navigate('/dashboard');
    }
  }, [user, navigate, justSignedUp, redirectTo]);

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
    mode === 'login' ? 'Enter your credentials to access the platform.' :
    mode === 'signup' ? 'Join the AETHER intelligence platform.' :
    'Enter your email and we will send you a reset link.';

  const cta =
    mode === 'login' ? 'Sign in' :
    mode === 'signup' ? 'Create account' :
    'Send reset link';

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={aetherLogo}
              alt="Aether Connect"
              className="h-9 w-auto"
              style={{ filter: "brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(800%) hue-rotate(195deg)" }}
            />
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left — editorial brand panel */}
        <div className="hidden lg:flex relative overflow-hidden" style={{ background: BRAND }}>
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)" }}
          />

          <div className="relative z-10 flex flex-col justify-between p-14 xl:p-20 w-full">
            <div className="text-white/70 text-xs tracking-[0.25em] uppercase font-medium">
              Aether Connect Platform
            </div>

            <div className="max-w-lg">
              <h2 className="text-white text-4xl xl:text-5xl font-semibold leading-[1.1] tracking-tight">
                Intelligence infrastructure for pharmaceutical operations.
              </h2>
              <p className="text-white/70 text-base mt-6 leading-relaxed font-light">
                A single secure workspace for compliance, supply chain, executive intelligence and human resources, engineered for regulated industries.
              </p>
            </div>

            <div className="flex items-center gap-8 text-white/60 text-xs font-medium">
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                SOC 2 aligned
              </div>
              <div className="inline-flex items-center gap-2">
                <Lock className="w-4 h-4" />
                GDPR compliant
              </div>
              <div className="hidden xl:inline-flex items-center gap-2">
                ISO 27001 controls
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-[400px]">
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {title}
              </h1>
              <p className="text-gray-500 text-sm mt-2.5 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-gray-700 tracking-wide">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-white border-gray-200 text-gray-900 text-sm rounded-md focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-gray-400"
                    style={{ ['--tw-ring-color' as never]: BRAND }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-gray-700 tracking-wide">
                  {mode === 'login' ? 'Email or username' : 'Work email'}
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={mode === 'login' ? 'name@company.com' : 'name@company.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-white border-gray-200 text-gray-900 text-sm rounded-md focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-gray-400"
                  style={{ ['--tw-ring-color' as never]: BRAND }}
                  required
                />
              </div>

              {mode !== 'reset' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-gray-700 tracking-wide">
                      Password
                    </Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('reset')}
                        className="text-xs font-medium hover:underline"
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
                      className="h-11 bg-white border-gray-200 text-gray-900 text-sm rounded-md pr-10 focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-gray-400"
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
                className="w-full h-11 text-white text-sm font-semibold rounded-md transition-all hover:opacity-95 disabled:opacity-60 flex items-center justify-center mt-2"
                style={{ background: BRAND }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : cta}
              </button>
            </form>

            {/* Mode switch */}
            <div className="mt-8 text-center text-sm">
              {mode === 'login' && (
                <p className="text-gray-500">
                  New to Aether Connect?{' '}
                  <button onClick={() => setMode('signup')} className="font-semibold hover:underline" style={{ color: BRAND }}>
                    Create an account
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">
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

            <div className="mt-12 pt-6 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400 tracking-wide">
                Protected by enterprise grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
