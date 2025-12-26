-- Create demo_requests table for storing demo requests from landing page
CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit demo request"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view demo requests
CREATE POLICY "Admins can view demo requests"
ON public.demo_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update demo requests
CREATE POLICY "Admins can update demo requests"
ON public.demo_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete demo requests
CREATE POLICY "Admins can delete demo requests"
ON public.demo_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));