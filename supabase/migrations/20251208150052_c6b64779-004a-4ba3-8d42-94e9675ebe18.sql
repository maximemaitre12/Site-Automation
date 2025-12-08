-- Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For SELECT operations (after trigger on row access)
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      auth.uid(),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id::text,
      jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      auth.uid(),
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id::text,
      jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      auth.uid(),
      'INSERT',
      TG_TABLE_NAME,
      NEW.id::text,
      jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Add audit trigger for user_api_keys table (sensitive credentials)
DROP TRIGGER IF EXISTS audit_user_api_keys_changes ON public.user_api_keys;
CREATE TRIGGER audit_user_api_keys_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_api_keys
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();

-- Add audit trigger for candidates table (sensitive PII)
DROP TRIGGER IF EXISTS audit_candidates_changes ON public.candidates;
CREATE TRIGGER audit_candidates_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();

-- Add index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);