-- Create a trigger function to auto-assign new users to Aether Admin company
CREATE OR REPLACE FUNCTION public.auto_assign_to_aether_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  aether_company_id uuid := '378cfe0d-b202-48bf-af4a-c1585e73702b';
BEGIN
  -- Insert the new user into user_roles with 'viewer' role for Aether Admin company
  INSERT INTO public.user_roles (user_id, company_id, role)
  VALUES (NEW.id, aether_company_id, 'viewer')
  ON CONFLICT (user_id, company_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to auto-assign company after user creation
CREATE OR REPLACE TRIGGER on_auth_user_created_assign_company
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_to_aether_company();