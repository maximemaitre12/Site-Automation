// ==========================================
// N8N Style Block Palette
// Exact replica of N8N node picker UI
// ==========================================

import { useState, useMemo } from 'react';
import { 
  N8N_BLOCK_DEFINITIONS, 
  N8NBlockType, 
  N8NBlockDefinition,
  N8NCategory,
  N8N_CATEGORY_CONFIG,
  getBlocksByCategory
} from '@/types/workflow-n8n';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface N8NBlockPaletteProps {
  onAddBlock: (type: N8NBlockType) => void;
}

const CATEGORY_ORDER: N8NCategory[] = ['trigger', 'logic', 'ai', 'tools', 'data'];

export function N8NBlockPalette({ onAddBlock }: N8NBlockPaletteProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<N8NCategory | 'all'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<N8NCategory>>(
    new Set(['trigger', 'logic', 'ai'])
  );

  const toggleCategory = (cat: N8NCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // All blocks as array
  const allBlocks = useMemo(() => {
    return Object.values(N8N_BLOCK_DEFINITIONS);
  }, []);

  // Filter by search
  const filteredBlocks = useMemo(() => {
    if (!search) return allBlocks;
    const query = search.toLowerCase();
    return allBlocks.filter(block => 
      block.name.toLowerCase().includes(query) ||
      block.description.toLowerCase().includes(query)
    );
  }, [allBlocks, search]);

  // Filter by category
  const categoryFiltered = useMemo(() => {
    if (activeCategory === 'all') return filteredBlocks;
    return filteredBlocks.filter(block => block.category === activeCategory);
  }, [filteredBlocks, activeCategory]);

  // Group by category for display
  const blocksByCategory = useMemo(() => {
    const grouped: Record<N8NCategory, N8NBlockDefinition[]> = {
      trigger: [],
      logic: [],
      ai: [],
      tools: [],
      data: []
    };
    
    categoryFiltered.forEach(block => {
      grouped[block.category].push(block);
    });
    
    return grouped;
  }, [categoryFiltered]);

  const renderBlockItem = (block: N8NBlockDefinition) => {
    const IconComponent = (LucideIcons as any)[block.icon] || LucideIcons.Box;
    
    return (
      <button
        key={block.type}
        onClick={() => onAddBlock(block.type)}
        className={cn(
          "w-full flex items-center gap-3 p-2.5 rounded-lg",
          "bg-white border border-gray-200 hover:border-gray-300",
          "hover:shadow-sm transition-all group text-left"
        )}
      >
        {/* Icon square */}
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
          style={{ backgroundColor: block.color + '15', border: `1px solid ${block.color}30` }}
        >
          <IconComponent 
            className="w-4.5 h-4.5" 
            style={{ color: block.color }}
            strokeWidth={1.5}
          />
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {block.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {block.description}
          </p>
        </div>

        {/* Add indicator */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <LucideIcons.Plus className="w-4 h-4 text-gray-400" />
        </div>
      </button>
    );
  };

  const renderCategorySection = (category: N8NCategory) => {
    const blocks = blocksByCategory[category];
    if (blocks.length === 0) return null;

    const config = N8N_CATEGORY_CONFIG[category];
    const isExpanded = expandedCategories.has(category) || search !== '';
    const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Box;

    return (
      <div key={category} className="border-b border-gray-100 last:border-b-0">
        {/* Category header */}
        <button
          onClick={() => toggleCategory(category)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: config.color + '15' }}
            >
              <IconComponent 
                className="w-3.5 h-3.5" 
                style={{ color: config.color }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {config.label}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {blocks.length}
            </span>
          </div>
          {isExpanded ? (
            <LucideIcons.ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <LucideIcons.ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Blocks list */}
        {isExpanded && (
          <div className="px-3 pb-3 space-y-1.5">
            {blocks.map(block => renderBlockItem(block))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Node</h3>
        
        {/* Search */}
        <div className="relative">
          <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="pl-9 h-9 bg-gray-50 border-gray-200 text-sm"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <LucideIcons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results count when searching */}
        {search && (
          <p className="text-xs text-gray-500 mt-2">
            {categoryFiltered.length} node{categoryFiltered.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-gray-200 px-2 overflow-x-auto bg-gray-50">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            "px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
            activeCategory === 'all'
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          All
        </button>
        {CATEGORY_ORDER.map(cat => {
          const config = N8N_CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                activeCategory === cat
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Blocks list */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {CATEGORY_ORDER.map(cat => renderCategorySection(cat))}
          
          {categoryFiltered.length === 0 && (
            <div className="text-center py-12 px-4">
              <LucideIcons.Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No nodes found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer hint */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Drag nodes onto canvas or click to add
        </p>
      </div>
    </aside>
  );
}
