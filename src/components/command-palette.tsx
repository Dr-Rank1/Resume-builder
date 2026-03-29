// ============================================
// ENTERPRISE UI - COMMAND PALETTE & SHORTCUTS
// Notion-style command palette with keyboard navigation
// ============================================

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Plus, 
  Settings, 
  Moon, 
  Sun,
  Users,
  Briefcase,
  BarChart3,
  CreditCard,
  HelpCircle,
  Sparkles,
  Download,
  Share2,
  ChevronRight,
  Command,
  X,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string[];
  category?: string;
  disabled?: boolean;
}

interface CommandGroup {
  label: string;
  items: CommandItem[];
}

interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

// ============================================
// CONTEXT
// ============================================

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  }
  return context;
}

// ============================================
// COMMAND PALETTE COMPONENT
// ============================================

interface CommandPaletteProps {
  children: React.ReactNode;
  groups?: CommandGroup[];
  onSearch?: (query: string) => void;
}

export function CommandPaletteProvider({ 
  children, 
  groups = [],
  onSearch 
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, close]);

  // Filter items based on query
  const filteredGroups = groups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(group => group.items.length > 0);

  // Flatten all items for navigation
  const allItems = filteredGroups.flatMap(group => group.items);
  const maxIndex = Math.max(0, allItems.length - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (allItems[selectedIndex] && !allItems[selectedIndex].disabled) {
            allItems[selectedIndex].action();
            close();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems, close, maxIndex]);

  // Call onSearch when query changes
  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const contextValue: CommandPaletteContextValue = {
    isOpen,
    open,
    close,
    toggle,
  };

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      
      {isOpen && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex items-start justify-center pt-[20vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800">
                  <Search className="w-5 h-5 text-zinc-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-500 outline-none text-base"
                  />
                  <kbd className="px-2 py-1 text-xs text-zinc-500 bg-zinc-800 rounded">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto py-2">
                  {filteredGroups.length === 0 ? (
                    <div className="px-4 py-8 text-center text-zinc-500">
                      No results found
                    </div>
                  ) : (
                    filteredGroups.map((group, groupIndex) => (
                      <div key={group.label}>
                        <div className="px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          {group.label}
                        </div>
                        <div className="space-y-1 px-2">
                          {group.items.map((item, itemIndex) => {
                            const globalIndex = filteredGroups
                              .slice(0, groupIndex)
                              .reduce((sum, g) => sum + g.items.length, 0) + itemIndex;
                            
                            return (
                              <CommandItemButton
                                key={item.id}
                                item={item}
                                isSelected={selectedIndex === globalIndex}
                                onSelect={() => {
                                  if (!item.disabled) {
                                    item.action();
                                    close();
                                  }
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 text-xs text-zinc-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd>
                      Select
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Command className="w-3 h-3" />
                    <span>K to toggle</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </CommandPaletteContext.Provider>
  );
}

// ============================================
// COMMAND ITEM BUTTON
// ============================================

function CommandItemButton({
  item,
  isSelected,
  onSelect,
}: {
  item: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={item.disabled}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
        isSelected 
          ? 'bg-zinc-800 text-white' 
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white',
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <div className="flex-1 text-left">
        <div className="text-sm font-medium">{item.label}</div>
        {item.description && (
          <div className="text-xs text-zinc-500">{item.description}</div>
        )}
      </div>
      {item.shortcut && (
        <div className="flex items-center gap-1">
          {item.shortcut.map((key, i) => (
            <kbd
              key={i}
              className="px-1.5 py-0.5 text-xs bg-zinc-800 rounded"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
      {isSelected && <ChevronRight className="w-4 h-4" />}
    </button>
  );
}

// ============================================
// KEYBOARD SHORTCUTS HOOK
// ============================================

interface ShortcutConfig {
  key: string;
  callback: () => void;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.meta ? (e.metaKey || e.ctrlKey) : true;
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.metaKey && !e.ctrlKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        // More flexible matching
        const modifierMatch = 
          (shortcut.meta && (e.metaKey || e.ctrlKey)) ||
          (!shortcut.meta && !shortcut.ctrl && !e.metaKey && !e.ctrlKey);

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          modifierMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// ============================================
// DEFAULT COMMAND GROUPS
// ============================================

export function getDefaultCommandGroups(
  actions: {
    createResume?: () => void;
    openDashboard?: () => void;
    openSettings?: () => void;
    openBilling?: () => void;
    openAnalytics?: () => void;
    toggleTheme?: () => void;
    openHelp?: () => void;
    generateAI?: () => void;
    exportResume?: () => void;
    shareResume?: () => void;
  }
): CommandGroup[] {
  return [
    {
      label: 'Navigation',
      items: [
        {
          id: 'dashboard',
          label: 'Go to Dashboard',
          icon: <BarChart3 className="w-5 h-5" />,
          action: actions.openDashboard || (() => {}),
          shortcut: ['G', 'D'],
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-5 h-5" />,
          action: actions.openSettings || (() => {}),
          shortcut: ['G', 'S'],
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 className="w-5 h-5" />,
          action: actions.openAnalytics || (() => {}),
          shortcut: ['G', 'A'],
        },
        {
          id: 'billing',
          label: 'Billing',
          icon: <CreditCard className="w-5 h-5" />,
          action: actions.openBilling || (() => {}),
          shortcut: ['G', 'B'],
        },
      ],
    },
    {
      label: 'Resume',
      items: [
        {
          id: 'create-resume',
          label: 'Create New Resume',
          icon: <Plus className="w-5 h-5" />,
          action: actions.createResume || (() => {}),
          shortcut: ['N'],
        },
        {
          id: 'export-resume',
          label: 'Export Resume',
          icon: <Download className="w-5 h-5" />,
          action: actions.exportResume || (() => {}),
        },
        {
          id: 'share-resume',
          label: 'Share Resume',
          icon: <Share2 className="w-5 h-5" />,
          action: actions.shareResume || (() => {}),
        },
      ],
    },
    {
      label: 'AI Features',
      items: [
        {
          id: 'ai-generate',
          label: 'AI Resume Generator',
          description: 'Generate a new resume with AI assistance',
          icon: <Sparkles className="w-5 h-5" />,
          action: actions.generateAI || (() => {}),
          shortcut: ['A', 'G'],
        },
      ],
    },
    {
      label: 'Preferences',
      items: [
        {
          id: 'toggle-theme',
          label: 'Toggle Theme',
          icon: <Moon className="w-5 h-5" />,
          action: actions.toggleTheme || (() => {}),
          shortcut: ['T'],
        },
        {
          id: 'help',
          label: 'Help & Support',
          icon: <HelpCircle className="w-5 h-5" />,
          action: actions.openHelp || (() => {}),
          shortcut: ['?'],
        },
      ],
    },
  ];
}

// ============================================
// ANIMATED ENTRANCE COMPONENT
// ============================================

interface AnimatedEntranceProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedEntrance({ 
  children, 
  delay = 0,
  className 
}: AnimatedEntranceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// STAGGERED LIST ANIMATION
// ============================================

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredList({ 
  children, 
  staggerDelay = 0.1,
  className 
}: StaggeredListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: (id: string) => void;
}) {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]',
        'bg-zinc-900 border border-zinc-800'
      )}
    >
      <div className={cn('flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm', colors[toast.type])}>
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-zinc-400 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-zinc-500 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ============================================
// LOADER COMPONENT
// ============================================

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loading({ size = 'md', className }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={cn(
        'rounded-full border-zinc-200 border-t-zinc-900 animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

// ============================================
// SKELETON LOADER
// ============================================

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-zinc-800',
        variants[variant],
        className
      )}
    />
  );
}