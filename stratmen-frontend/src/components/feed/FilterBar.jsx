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
    <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border-subtle bg-bg-white overflow-x-auto">
      {filters.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap',
              isActive
                ? 'bg-green-soft text-green-deep shadow-sm'
                : 'text-text-mid hover:text-text-dark hover:bg-bg-warm'
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
