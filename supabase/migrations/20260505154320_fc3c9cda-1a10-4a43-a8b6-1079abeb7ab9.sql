
CREATE TABLE public.bracelet_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount NUMERIC(6,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'sepa',
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bracelet_orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public checkout, no auth required)
CREATE POLICY "Anyone can create bracelet orders"
ON public.bracelet_orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read orders
CREATE POLICY "Admins can view all bracelet orders"
ON public.bracelet_orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update orders
CREATE POLICY "Admins can update bracelet orders"
ON public.bracelet_orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_bracelet_orders_updated_at
BEFORE UPDATE ON public.bracelet_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
