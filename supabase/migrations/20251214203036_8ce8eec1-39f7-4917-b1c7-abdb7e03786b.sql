-- Add company enrichment data to sales_deals
ALTER TABLE public.sales_deals
ADD COLUMN IF NOT EXISTS company_enrichment jsonb DEFAULT NULL;

-- Add a comment to document the column
COMMENT ON COLUMN public.sales_deals.company_enrichment IS 'Enriched company data from official sources for deal context';