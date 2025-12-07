import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Save, Trash2, Key } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface ApiKey {
  id: string;
  service_name: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

const API_SERVICES = [
  {
    name: 'resend',
    label: 'Resend (Email)',
    description: 'Clé API pour l\'envoi d\'emails via Resend',
    placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://resend.com/api-keys',
    icon: '📧'
  },
  {
    name: 'telegram',
    label: 'Telegram Bot',
    description: 'Token de bot Telegram pour envoyer des messages',
    placeholder: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
    helpUrl: 'https://core.telegram.org/bots#creating-a-new-bot',
    icon: '✈️'
  },
  {
    name: 'slack',
    label: 'Slack',
    description: 'Token OAuth pour poster des messages Slack',
    placeholder: 'xoxb-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://api.slack.com/tutorials/tracks/getting-a-token',
    icon: '💬'
  },
  {
    name: 'discord',
    label: 'Discord Webhook',
    description: 'URL de webhook Discord pour poster des messages',
    placeholder: 'https://discord.com/api/webhooks/...',
    helpUrl: 'https://support.discord.com/hc/en-us/articles/228383668',
    icon: '🎮'
  },
  {
    name: 'twilio',
    label: 'Twilio (SMS)',
    description: 'Clés Twilio pour envoyer des SMS (format: SID:AuthToken)',
    placeholder: 'ACxxxxxxxx:xxxxxxxx',
    helpUrl: 'https://console.twilio.com/',
    icon: '📱'
  },
  {
    name: 'sendgrid',
    label: 'SendGrid (Email)',
    description: 'Clé API SendGrid pour l\'envoi d\'emails',
    placeholder: 'SG.xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://app.sendgrid.com/settings/api_keys',
    icon: '📬'
  },
  {
    name: 'openai',
    label: 'OpenAI',
    description: 'Clé API pour les fonctionnalités IA personnalisées',
    placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://platform.openai.com/api-keys',
    icon: '🤖'
  },
  {
    name: 'notion',
    label: 'Notion',
    description: 'Token d\'intégration Notion pour accéder aux bases de données',
    placeholder: 'secret_xxxxxxxxxxxxxxxxxxxxxxxx',
    helpUrl: 'https://www.notion.so/my-integrations',
    icon: '📝'
  },
  {
    name: 'airtable',
    label: 'Airtable',
    description: 'Token API Airtable pour accéder aux bases',
    placeholder: 'patxxxxxxxxxxxxxxxx',
    helpUrl: 'https://airtable.com/create/tokens',
    icon: '📊'
  }
];

export default function ApiKeys() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, ApiKey>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const keysMap: Record<string, ApiKey> = {};
      const valuesMap: Record<string, string> = {};
      
      data?.forEach(key => {
        keysMap[key.service_name] = key;
        valuesMap[key.service_name] = key.api_key;
      });

      setSavedKeys(keysMap);
      setKeys(valuesMap);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les clés API',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async (serviceName: string) => {
    if (!user || !keys[serviceName]?.trim()) return;

    setSaving(prev => ({ ...prev, [serviceName]: true }));

    try {
      const existingKey = savedKeys[serviceName];

      if (existingKey) {
        const { error } = await supabase
          .from('user_api_keys')
          .update({ api_key: keys[serviceName].trim() })
          .eq('id', existingKey.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_api_keys')
          .insert({
            user_id: user.id,
            service_name: serviceName,
            api_key: keys[serviceName].trim()
          });

        if (error) throw error;
      }

      await fetchApiKeys();
      
      toast({
        title: 'Clé API sauvegardée',
        description: `La clé ${serviceName} a été enregistrée avec succès`
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la clé API',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, [serviceName]: false }));
    }
  };

  const handleDeleteKey = async (serviceName: string) => {
    const existingKey = savedKeys[serviceName];
    if (!existingKey) return;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', existingKey.id);

      if (error) throw error;

      setKeys(prev => ({ ...prev, [serviceName]: '' }));
      setSavedKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[serviceName];
        return newKeys;
      });

      toast({
        title: 'Clé API supprimée',
        description: `La clé ${serviceName} a été supprimée`
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la clé API',
        variant: 'destructive'
      });
    }
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Key className="w-6 h-6" />
            Clés API
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos clés API pour activer les fonctionnalités avancées
          </p>
        </div>

        <div className="space-y-6">
          {API_SERVICES.map(service => (
            <Card key={service.name}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>{service.icon}</span>
                  {service.label}
                  {savedKeys[service.name] && (
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">Configuré</span>
                  )}
                </CardTitle>
                <CardDescription>
                  {service.description}
                  {service.helpUrl && (
                    <a 
                      href={service.helpUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      Obtenir une clé →
                    </a>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`key-${service.name}`}>Clé API</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`key-${service.name}`}
                          type={showKeys[service.name] ? 'text' : 'password'}
                          placeholder={service.placeholder}
                          value={keys[service.name] || ''}
                          onChange={(e) => setKeys(prev => ({ ...prev, [service.name]: e.target.value }))}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowKeys(prev => ({ ...prev, [service.name]: !prev[service.name] }))}
                        >
                          {showKeys[service.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleSaveKey(service.name)}
                        disabled={saving[service.name] || !keys[service.name]?.trim()}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving[service.name] ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                      {savedKeys[service.name] && (
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteKey(service.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {savedKeys[service.name] && (
                    <p className="text-sm text-muted-foreground">
                      ✓ Clé configurée le {new Date(savedKeys[service.name].updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
