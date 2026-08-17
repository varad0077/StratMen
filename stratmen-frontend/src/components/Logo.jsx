import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Logo = ({ className, size = 'default', showSubtitle = true, to = '/' }) => {
  const iconSizes = {
    sm: 'h-5 w-5',
    default: 'h-7 w-7',
    lg: 'h-9 w-9',
  };

  const textSizes = {
    sm: 'text-base',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 group cursor-pointer', className)}>
      {/* Icon mark */}
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-green-soft border border-border-subtle group-hover:border-green-deep/30 transition-all duration-300">
        <Shield className={cn('text-green-deep transition-transform duration-300 group-hover:scale-110', iconSizes[size])} />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span className={cn('font-bold tracking-tight leading-tight font-manrope', textSizes[size])}>
          <span className="text-text-dark">Strat</span>
          <span className="text-green-deep">Men</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-text-muted font-semibold -mt-0.5">
            Foundation
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};
