import { useState, useCallback } from 'react';
import { perplexityApi, firecrawlApi } from '@/lib/api/integrations';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  content: string;
  citations?: string[];
  model?: string;
}

interface ScrapeResult {
  success: boolean;
  markdown?: string;
  html?: string;
  links?: string[];
  metadata?: {
    title?: string;
    description?: string;
    sourceURL?: string;
  };
  error?: string;
}

export function useWebSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const { toast } = useToast();

  const searchWeb = useCallback(async (
    query: string, 
    options?: {
      model?: 'sonar' | 'sonar-pro' | 'sonar-reasoning';
      recencyFilter?: 'day' | 'week' | 'month' | 'year';
    }
  ): Promise<SearchResult | null> => {
    if (!query.trim()) return null;

    setIsSearching(true);
    try {
      const result = await perplexityApi.search(query, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Recherche échouée');
      }

      return {
        content: result.content,
        citations: result.citations,
        model: result.model,
      };
    } catch (error) {
      console.error('Web search error:', error);
      toast({
        title: "Erreur de recherche",
        description: error instanceof Error ? error.message : "Échec de la recherche web",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const scrapeUrl = useCallback(async (
    url: string,
    options?: {
      formats?: ('markdown' | 'html' | 'links')[];
      onlyMainContent?: boolean;
    }
  ): Promise<ScrapeResult | null> => {
    if (!url.trim()) return null;

    setIsScraping(true);
    try {
      const result = await firecrawlApi.scrape(url, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Scraping échoué');
      }

      return {
        success: true,
        markdown: result.data?.markdown,
        html: result.data?.html,
        links: result.data?.links,
        metadata: result.data?.metadata,
      };
    } catch (error) {
      console.error('Scrape error:', error);
      toast({
        title: "Erreur de scraping",
        description: error instanceof Error ? error.message : "Échec du scraping",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsScraping(false);
    }
  }, [toast]);

  const searchAndScrape = useCallback(async (query: string, limit = 3) => {
    setIsSearching(true);
    try {
      const result = await firecrawlApi.search(query, { 
        limit,
        scrapeOptions: { formats: ['markdown'] }
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Recherche échouée');
      }

      return result.data;
    } catch (error) {
      console.error('Search and scrape error:', error);
      toast({
        title: "Erreur de recherche",
        description: error instanceof Error ? error.message : "Échec de la recherche",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  return {
    searchWeb,
    scrapeUrl,
    searchAndScrape,
    isSearching,
    isScraping,
  };
}
