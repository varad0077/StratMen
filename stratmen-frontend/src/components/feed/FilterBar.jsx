import React from 'react';
import { Layers, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All Posts', icon: Layers },
    { key: 'saved', label: 'Saved', icon: Bookmark },
    { key: 'mine', label: 'My Posts', icon: User },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-surface-dark overflow-x-auto">
      {filters.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap',
              isActive
                ? 'bg-accent text-bg-dark shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
