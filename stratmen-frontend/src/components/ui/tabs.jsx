import * as React from 'react';
import { cn } from '@/lib/utils';

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full', className)} {...props} />
));
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-start gap-1 rounded-lg bg-bg-warm p-1 border border-border-subtle',
      'overflow-x-auto',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-deep',
      'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
      active
        ? 'bg-bg-white text-green-deep shadow-sm border border-border-subtle'
        : 'text-text-mid hover:text-text-dark hover:bg-bg-white/60',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 animate-fade-in', className)}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
