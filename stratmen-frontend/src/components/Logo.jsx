import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Logo = ({ className, size = 'default', showSubtitle = true, to = '/' }) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizes = {
    sm: 'text-base',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 group cursor-pointer', className)}>
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-surface-elevated border border-border-light group-hover:border-accent/50 transition-all duration-300">
        <Shield className={cn('text-accent transition-transform duration-300 group-hover:scale-110', iconSizes[size])} />
        <div className="absolute inset-0 bg-accent/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col">
        <span className={cn('font-bold tracking-tight text-text-primary leading-tight', textSizes[size])}>
          Strat<span className="text-accent">Men</span>
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
