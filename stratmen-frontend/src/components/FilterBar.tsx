import React from 'react';
import { FeedFilter } from '../types';

interface FilterBarProps {
  activeFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  totalFiltered
}) => {
  return (
    <div className="card filter-bar-card">
      <div className="filter-tags-row">
        <div className="filter-tags-scroll">
          <button
            type="button"
            className={`filter-chip ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => onFilterChange('ALL')}
          >
            All Updates
          </button>

          <button
            type="button"
            className={`filter-chip ${activeFilter === 'SAVED' ? 'active' : ''}`}
            onClick={() => onFilterChange('SAVED')}
          >
            Saved
          </button>

          <button
            type="button"
            className={`filter-chip ${activeFilter === 'MY_POSTS' ? 'active' : ''}`}
            onClick={() => onFilterChange('MY_POSTS')}
          >
            My Posts
          </button>
        </div>

        <div className="filtered-count-badge">
          <span>{totalFiltered} {totalFiltered === 1 ? 'post' : 'posts'}</span>
        </div>
      </div>
    </div>
  );
};
