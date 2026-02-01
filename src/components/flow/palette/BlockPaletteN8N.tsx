// ==========================================
// Block Palette - N8N Style Navigation
// Hierarchical categories with search
// ==========================================

import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  BLOCK_LIBRARY, 
  CATEGORY_CONFIG, 
  SUBCATEGORY_CONFIG,
  BlockCategory,
  BlockSubcategory,
  BlockDefinition,
  searchBlocks,
  getPopularBlocks
} from '@/types/block-library';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BlockPaletteN8NProps {
  onAddBlock: (type: string, definition: BlockDefinition) => void;
  onClose?: () => void;
  className?: string;
}

type ViewState = 
  | { type: 'root' }
  | { type: 'category'; category: BlockCategory }
  | { type: 'subcategory'; category: BlockCategory; subcategory: BlockSubcategory };

export function BlockPaletteN8N({ onAddBlock, onClose, className }: BlockPaletteN8NProps) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewState>({ type: 'root' });

  // Get blocks based on current view and search
  const displayBlocks = useMemo(() => {
    if (search) {
      return searchBlocks(search);
    }
    
    if (view.type === 'subcategory') {
      return BLOCK_LIBRARY.filter(b => b.subcategory === view.subcategory);
    }
    
    if (view.type === 'category') {
      return BLOCK_LIBRARY.filter(b => b.category === view.category);
    }
    
    return [];
  }, [search, view]);

  // Get subcategories for current category
  const subcategories = useMemo(() => {
    if (view.type !== 'category') return [];
    
    const subs = new Set<BlockSubcategory>();
    BLOCK_LIBRARY
      .filter(b => b.category === view.category && b.subcategory)
      .forEach(b => subs.add(b.subcategory!));
    
    return Array.from(subs);
  }, [view]);

  // Get popular blocks for current category
  const popularBlocks = useMemo(() => {
    if (view.type !== 'category') return [];
    return BLOCK_LIBRARY.filter(b => b.category === view.category && b.popular);
  }, [view]);

  // Blocks without subcategory in current category
  const uncategorizedBlocks = useMemo(() => {
    if (view.type !== 'category') return [];
    return BLOCK_LIBRARY.filter(b => b.category === view.category && !b.subcategory);
  }, [view]);

  const goBack = () => {
    if (view.type === 'subcategory') {
      setView({ type: 'category', category: view.category });
    } else if (view.type === 'category') {
      setView({ type: 'root' });
    }
  };

  const renderIcon = (iconName: string, color: string, size: number = 20) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return <IconComponent className="shrink-0" style={{ color }} size={size} strokeWidth={1.5} />;
  };

  const renderBlockItem = (block: BlockDefinition) => (
    <button
      key={block.type}
      onClick={() => onAddBlock(block.type, block)}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg",
        "bg-white border border-gray-100 hover:border-gray-200",
        "hover:shadow-sm transition-all group text-left"
      )}
    >
      <div 
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: block.color + '15' }}
      >
        {renderIcon(block.icon, block.color, 18)}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {block.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {block.description}
        </p>
      </div>

      {block.requiresAuth && (
        <LucideIcons.Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      )}
      
      <LucideIcons.ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );

  const renderCategoryItem = (category: BlockCategory) => {
    const config = CATEGORY_CONFIG[category];
    const count = BLOCK_LIBRARY.filter(b => b.category === category).length;
    
    return (
      <button
        key={category}
        onClick={() => setView({ type: 'category', category })}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-lg",
          "hover:bg-gray-50 transition-all group text-left"
        )}
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: config.color + '15' }}
        >
          {renderIcon(config.icon, config.color, 20)}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {config.label}
          </p>
          <p className="text-xs text-gray-500">
            {config.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
          <LucideIcons.ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </button>
    );
  };

  const renderSubcategoryItem = (subcategory: BlockSubcategory) => {
    const config = SUBCATEGORY_CONFIG[subcategory];
    const count = BLOCK_LIBRARY.filter(b => b.subcategory === subcategory).length;
    
    return (
      <button
        key={subcategory}
        onClick={() => setView({ type: 'subcategory', category: view.type === 'category' ? view.category : 'trigger', subcategory })}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg",
          "hover:bg-gray-50 transition-all group text-left"
        )}
      >
        {renderIcon(config.icon, '#64748b', 18)}
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">
            {config.label}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {count}
          </span>
          <LucideIcons.ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </button>
    );
  };

  // Header with back button
  const renderHeader = () => {
    if (view.type === 'root' && !search) {
      return (
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Add Node</h3>
            <p className="text-xs text-gray-500">Select a node to add to your workflow</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LucideIcons.X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      );
    }

    let title = '';
    let subtitle = '';
    
    if (search) {
      title = 'Search Results';
      subtitle = `${displayBlocks.length} node${displayBlocks.length !== 1 ? 's' : ''} found`;
    } else if (view.type === 'category') {
      const config = CATEGORY_CONFIG[view.category];
      title = config.label;
      subtitle = config.description;
    } else if (view.type === 'subcategory') {
      const config = SUBCATEGORY_CONFIG[view.subcategory];
      title = config.label;
      subtitle = `${displayBlocks.length} nodes`;
    }

    return (
      <div className="p-3 border-b border-gray-100 flex items-center gap-2">
        <button
          onClick={search ? () => setSearch('') : goBack}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LucideIcons.ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        {view.type === 'category' && !search && (
          <div 
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: CATEGORY_CONFIG[view.category].color + '15' }}
          >
            {renderIcon(CATEGORY_CONFIG[view.category].icon, CATEGORY_CONFIG[view.category].color, 14)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LucideIcons.X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    );
  };

  return (
    <aside className={cn("w-80 border-l border-gray-200 bg-white flex flex-col h-full", className)}>
      {renderHeader()}
      
      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="pl-9 h-9 bg-gray-50 border-gray-200 text-sm focus:bg-white"
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {/* Search results */}
          {search && (
            <>
              {displayBlocks.length > 0 ? (
                displayBlocks.map(block => renderBlockItem(block))
              ) : (
                <div className="text-center py-12 px-4">
                  <LucideIcons.Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No nodes found</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                </div>
              )}
            </>
          )}

          {/* Root view - show categories */}
          {!search && view.type === 'root' && (
            <>
              {/* Add another trigger hint */}
              <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 text-purple-700 text-xs font-medium">
                  <LucideIcons.Zap className="w-4 h-4" />
                  <span>Start with a Trigger</span>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Triggers start your workflow. Every workflow needs one.
                </p>
              </div>
              
              {Object.keys(CATEGORY_CONFIG).map(cat => 
                renderCategoryItem(cat as BlockCategory)
              )}
            </>
          )}

          {/* Category view - show subcategories and popular blocks */}
          {!search && view.type === 'category' && (
            <>
              {/* Popular section */}
              {popularBlocks.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1 mb-2">
                    Popular
                  </h4>
                  <div className="space-y-1">
                    {popularBlocks.map(block => renderBlockItem(block))}
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1 mb-2">
                    Categories
                  </h4>
                  <div className="space-y-0.5">
                    {subcategories.map(sub => renderSubcategoryItem(sub))}
                  </div>
                </div>
              )}

              {/* Blocks without subcategory */}
              {uncategorizedBlocks.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1 mb-2">
                    All {CATEGORY_CONFIG[view.category].label}
                  </h4>
                  <div className="space-y-1">
                    {uncategorizedBlocks.map(block => renderBlockItem(block))}
                  </div>
                </div>
              )}

              {/* All blocks if no subcategories */}
              {subcategories.length === 0 && uncategorizedBlocks.length === 0 && (
                <div className="space-y-1">
                  {displayBlocks.map(block => renderBlockItem(block))}
                </div>
              )}
            </>
          )}

          {/* Subcategory view - show blocks */}
          {!search && view.type === 'subcategory' && (
            <div className="space-y-1">
              {displayBlocks.map(block => renderBlockItem(block))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Click to add node to canvas
        </p>
      </div>
    </aside>
  );
}
