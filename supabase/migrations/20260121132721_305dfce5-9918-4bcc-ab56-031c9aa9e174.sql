-- Create a function to auto-grant subscription for specific emails
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
    INSERT INTO public.subscriptions (user_id, status, plan)
    VALUES (NEW.id, 'active', 'enterprise')
    ON CONFLICT (user_id) DO UPDATE SET status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to auto-grant subscription
CREATE TRIGGER on_auth_user_created_grant_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_grant_subscription();