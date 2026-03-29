// ============================================
// TEMPLATE GALLERY
// Template selection UI with preview and filtering
// ============================================

'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Grid3X3, List, ChevronDown, Check, 
  Sparkles, Crown, Star, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  TEMPLATE_REGISTRY, 
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  getCategoriesWithTemplates,
  TemplateConfig,
  TemplateId,
} from './template-registry';

interface TemplateGalleryProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  className?: string;
}

// ============================================
// GALLERY COMPONENT
// ============================================

export const TemplateGallery = memo(function TemplateGallery({
  selectedTemplate,
  onSelectTemplate,
  className = '',
}: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPremium, setShowPremium] = useState(false);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let templates = TEMPLATE_REGISTRY;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        t => 
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      templates = templates.filter(t => t.category === activeCategory);
    }

    // Filter premium
    if (!showPremium) {
      templates = templates.filter(t => !t.isPremium);
    }

    return templates;
  }, [searchQuery, activeCategory, showPremium]);

  // Get categories with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: TEMPLATE_REGISTRY.length };
    Object.keys(TEMPLATE_CATEGORIES).forEach(cat => {
      counts[cat] = TEMPLATE_REGISTRY.filter(t => t.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-xl border p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          Choose Template
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-slate-400 hover:bg-slate-100'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-slate-400 hover:bg-slate-100'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className={cn(
            'w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500',
            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700',
            'text-slate-900 dark:text-white placeholder-slate-400'
          )}
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors',
            activeCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          )}
        >
          All ({categoryCounts.all})
        </button>
        {Object.entries(TEMPLATE_CATEGORIES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              activeCategory === key
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            {config.name} ({categoryCounts[key]})
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
          : 'space-y-2'
      )}>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onClick={() => onSelectTemplate(template.id)}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">No templates found</p>
        </div>
      )}
    </div>
  );
});

// ============================================
// TEMPLATE CARD
// Individual template preview card
// ============================================

interface TemplateCardProps {
  template: TemplateConfig;
  isSelected: boolean;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

const TemplateCard = memo(function TemplateCard({
  template,
  isSelected,
  onClick,
  viewMode,
}: TemplateCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative rounded-lg border-2 transition-all text-left group',
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
        viewMode === 'grid' ? 'p-3' : 'p-4 flex items-center gap-4'
      )}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Preview */}
      <div className={cn(
        'flex items-center justify-center mb-2 text-3xl',
        viewMode === 'list' && 'mb-0 w-12 h-12'
      )}>
        {template.preview}
      </div>

      {/* Info */}
      <div className={cn(viewMode === 'list' && 'flex-1')}>
        <div className="flex items-center gap-2">
          <h4 className={cn(
            'font-medium text-sm',
            viewMode === 'grid' ? 'text-center' : 'text-left',
            'text-slate-900 dark:text-white'
          )}>
            {template.name}
          </h4>
          {template.isPremium && (
            <Crown className="w-3 h-3 text-yellow-500" />
          )}
        </div>
        <p className={cn(
          'text-xs text-slate-500 mt-1',
          viewMode === 'grid' ? 'text-center' : 'text-left',
          'hidden sm:block'
        )}>
          {template.description}
        </p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
});

// ============================================
// TEMPLATE SELECTOR
// Compact template selector for toolbar
// ============================================

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  className?: string;
}

export const TemplateSelector = memo(function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  className = '',
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedConfig = TEMPLATE_REGISTRY.find(t => t.id === selectedTemplate);
  const categories = getCategoriesWithTemplates();

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
          'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
          'hover:border-slate-300 dark:hover:border-slate-600'
        )}
      >
        <span className="text-lg">{selectedConfig?.preview || '◻️'}</span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {selectedConfig?.name || 'Select Template'}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'absolute top-full mt-2 left-0 z-50 w-80',
                'bg-white dark:bg-slate-800 rounded-xl border shadow-lg',
                'max-h-96 overflow-y-auto'
              )}
            >
              <div className="p-3">
                {categories.map(({ category, templates }) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                      {TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES].name}
                    </h4>
                    <div className="space-y-1">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            onSelectTemplate(template.id);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                            selectedTemplate === template.id
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                          )}
                        >
                          <span className="text-xl">{template.preview}</span>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {template.name}
                            </span>
                          </div>
                          {template.isPremium && (
                            <Crown className="w-3 h-3 text-yellow-500" />
                          )}
                          {selectedTemplate === template.id && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

// ============================================
// TEMPLATE PREVIEW THUMBNAIL
// Small preview for gallery thumbnails
// ============================================

interface TemplatePreviewProps {
  templateId: TemplateId;
  className?: string;
}

export const TemplatePreviewThumbnail = memo(function TemplatePreviewThumbnail({
  templateId,
  className = '',
}: TemplatePreviewProps) {
  const config = TEMPLATE_REGISTRY.find(t => t.id === templateId);

  return (
    <div className={cn(
      'aspect-[3/4] rounded-lg border-2 border-slate-200 dark:border-slate-700',
      'flex items-center justify-center bg-white dark:bg-slate-800',
      'text-4xl',
      className
    )}>
      {config?.preview || '?'}
    </div>
  );
});

// ============================================
// EXPORTS
// ============================================

export default TemplateGallery;