import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowRight, Sparkles, Users, Zap, Shield } from 'lucide-react';
import { z } from 'zod';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
});

export default function Onboarding() {
  const navigate = useNavigate();
  const { createCompany, loading: companyLoading } = useCompany();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleNameChange = (value: string) => {
    setCompanyName(value);
    if (!companySlug || companySlug === generateSlug(companyName)) {
      setCompanySlug(generateSlug(value));
    }
  };

  const handleCreateCompany = async () => {
    setErrors({});
    
    const validation = companySchema.safeParse({ name: companyName, slug: companySlug });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setCreating(true);
    const company = await createCompany(companyName, companySlug);
    setCreating(false);

    if (company) {
      navigate('/dashboard');
    }
  };

  const features = [
    { icon: Zap, title: '9 AI Tools', description: 'Complete suite of AI-powered business tools' },
    { icon: Users, title: 'Team Collaboration', description: 'Work together with role-based access' },
    { icon: Shield, title: 'Enterprise Security', description: 'Bank-grade security and compliance' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">AETHER</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to AETHER AI Suite
            </h1>
            <p className="text-lg text-muted-foreground">
              Set up your workspace and start automating everything.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-border bg-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create Your Workspace</CardTitle>
              <CardDescription>
                Set up your company to get started with AETHER
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`bg-secondary border-border ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySlug">Workspace URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">aether.app/</span>
                    <Input
                      id="companySlug"
                      placeholder="acme"
                      value={companySlug}
                      onChange={(e) => setCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className={`bg-secondary border-border ${errors.slug ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug}</p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleCreateCompany}
                disabled={creating || !companyName || !companySlug}
                className="w-full"
              >
                {creating ? (
                  'Creating...'
                ) : (
                  <>
                    Create Workspace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By creating a workspace, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
