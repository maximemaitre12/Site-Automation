import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserApiKey {
  id: string;
  service_name: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

// Mapping between workflow config keys and service names
const KEY_TO_SERVICE_MAP: Record<string, string> = {
  // OpenAI
  'api_key': 'openai',
  'openai_api_key': 'openai',
  'apiKey': 'openai',
  // Resend
  'resend_api_key': 'resend',
  'resendApiKey': 'resend',
  // Telegram
  'telegram_token': 'telegram',
  'telegramToken': 'telegram',
  'bot_token': 'telegram',
  // Slack
  'slack_token': 'slack',
  'slackToken': 'slack',
  'slack_webhook': 'slack',
  // Discord
  'discord_webhook': 'discord',
  'discordWebhook': 'discord',
  'webhook_url': 'discord',
  // Twilio
  'twilio_sid': 'twilio',
  'twilio_auth_token': 'twilio',
  'twilioSid': 'twilio',
  // SendGrid
  'sendgrid_api_key': 'sendgrid',
  'sendgridApiKey': 'sendgrid',
  // Notion
  'notion_token': 'notion',
  'notionToken': 'notion',
  // Airtable
  'airtable_token': 'airtable',
  'airtableToken': 'airtable',
  // Stripe
  'stripe_api_key': 'stripe',
  'stripeApiKey': 'stripe',
  // GitHub
  'github_token': 'github',
  'githubToken': 'github',
  // Google
  'google_api_key': 'google',
  'googleApiKey': 'google',
  // Anthropic
  'anthropic_api_key': 'anthropic',
  'anthropicApiKey': 'anthropic',
  // Gemini
  'gemini_api_key': 'gemini',
  'geminiApiKey': 'gemini',
};

// Reverse mapping: service name to possible config keys
const SERVICE_TO_KEYS_MAP: Record<string, string[]> = {};
Object.entries(KEY_TO_SERVICE_MAP).forEach(([key, service]) => {
  if (!SERVICE_TO_KEYS_MAP[service]) {
    SERVICE_TO_KEYS_MAP[service] = [];
  }
  SERVICE_TO_KEYS_MAP[service].push(key);
});

export function useUserApiKeys() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<UserApiKey[]>([]);
  const [keysByService, setKeysByService] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchKeys = useCallback(async () => {
    if (!user) {
      setKeys([]);
      setKeysByService({});
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const keysArray = data || [];
      setKeys(keysArray);

      // Build service -> key value map
      const serviceMap: Record<string, string> = {};
      keysArray.forEach(k => {
        serviceMap[k.service_name] = k.api_key;
      });
      setKeysByService(serviceMap);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  // Get the service name from a config key
  const getServiceFromConfigKey = (configKey: string): string | null => {
    return KEY_TO_SERVICE_MAP[configKey] || KEY_TO_SERVICE_MAP[configKey.toLowerCase()] || null;
  };

  // Get API key value for a given config key
  const getKeyForConfigKey = (configKey: string): string | null => {
    const service = getServiceFromConfigKey(configKey);
    if (!service) return null;
    return keysByService[service] || null;
  };

  // Save or update a key for a service
  const saveKey = async (serviceName: string, apiKey: string): Promise<boolean> => {
    if (!user || !apiKey?.trim()) return false;

    try {
      const existingKey = keys.find(k => k.service_name === serviceName);

      if (existingKey) {
        const { error } = await supabase
          .from('user_api_keys')
          .update({ api_key: apiKey.trim() })
          .eq('id', existingKey.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_api_keys')
          .insert({
            user_id: user.id,
            service_name: serviceName,
            api_key: apiKey.trim()
          });

        if (error) throw error;
      }

      await fetchKeys();
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  };

  // Save a key from workflow config (auto-detect service)
  const saveKeyFromConfig = async (configKey: string, apiKey: string): Promise<boolean> => {
    const service = getServiceFromConfigKey(configKey);
    if (!service) {
      console.warn(`No service mapping for config key: ${configKey}`);
      return false;
    }
    return saveKey(service, apiKey);
  };

  // Delete a key
  const deleteKey = async (serviceName: string): Promise<boolean> => {
    const existingKey = keys.find(k => k.service_name === serviceName);
    if (!existingKey) return false;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', existingKey.id);

      if (error) throw error;

      await fetchKeys();
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  };

  // Check if a service has a key configured
  const hasKey = (serviceName: string): boolean => {
    return !!keysByService[serviceName];
  };

  // Get all configured services
  const getConfiguredServices = (): string[] => {
    return Object.keys(keysByService);
  };

  return {
    keys,
    keysByService,
    loading,
    fetchKeys,
    getServiceFromConfigKey,
    getKeyForConfigKey,
    saveKey,
    saveKeyFromConfig,
    deleteKey,
    hasKey,
    getConfiguredServices,
    KEY_TO_SERVICE_MAP,
    SERVICE_TO_KEYS_MAP,
  };
}
