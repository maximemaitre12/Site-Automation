-- Fix the auto_grant_subscription function with correct column names
CREATE OR REPLACE FUNCTION public.auto_grant_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_emails text[] := ARRAY[
    'x.galezowski@groupeonepoint.com',
    's.bernier@groupeonepoint.com'
  ];
BEGIN
  -- Check if the new user's email is in the allowed list
  IF NEW.email = ANY(allowed_emails) THEN
    INSERT INTO public.subscriptions (user_id, status, plan_id, plan_name, price_monthly)
    VALUES (NEW.id, 'active', 'enterprise', 'Enterprise', 2749.99)
    ON CONFLICT (user_id) DO UPDATE SET status = 'active', plan_id = 'enterprise', plan_name = 'Enterprise';
  END IF;
  
  RETURN NEW;
END;
$$;