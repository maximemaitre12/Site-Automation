import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Eye, EyeOff, Check, Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type AuthMode = 'login' | 'signup' | 'reset';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') as AuthMode || 'login';
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Track if user just signed up to redirect to plan selection
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    if (user) {
      if (justSignedUp) {
        navigate('/select-plan');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, justSignedUp]);

  const validateForm = () => {
    try {
      emailSchema.parse(email);
      if (mode !== 'reset') {
        passwordSchema.parse(password);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        setLoading(false);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          // Navigation is handled by useEffect when user state updates
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, name);
        setLoading(false);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in.');
          } else {
            toast.error(error.message);
          }
        } else {
          setJustSignedUp(true);
          toast.success('Account created successfully!');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        setLoading(false);
        if (error) {
          toast.error(error.message);
        } else {
          setResetSent(true);
          toast.success('Password reset email sent!');
        }
      }
    } catch (err) {
      setLoading(false);
      toast.error('An unexpected error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
    // Don't set loading to false on success - the page will redirect
  };

  const features = [
    "9 AI-powered tools",
    "Unlimited workflows",
    "14-day free trial",
    "No credit card required",
  ];

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Button variant="outline" onClick={() => { setMode('login'); setResetSent(false); }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            {mode === 'signup' ? 'Start your journey with' : 'Welcome back to'}
            <br />
            <span className="text-gradient">AETHER AI Suite</span>
          </h2>
          
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-foreground">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">AETHER</span>
          </Link>

          {/* Header */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === 'login' && 'Welcome back! Enter your credentials to continue.'}
            {mode === 'signup' && 'Get started with AETHER AI Suite today'}
            {mode === 'reset' && 'Enter your email and we\'ll send you a reset link.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-secondary border-border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary border-border"
                required
              />
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-secondary border-border pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  {mode === 'login' && 'Sign in'}
                  {mode === 'signup' && 'Create account'}
                  {mode === 'reset' && 'Send reset link'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {mode !== 'reset' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}
          </form>

          {/* Mode switch */}
          <div className="mt-8 text-center">
            {mode === 'login' && (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <>
                <p className="text-xs text-muted-foreground mb-4">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              </>
            )}
            {mode === 'reset' && (
              <button onClick={() => setMode('login')} className="text-sm text-primary hover:underline font-medium">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
