import * as React from 'react';
import { cn } from '@/lib/utils';

const TabsContext = React.createContext({
  value: '',
  onValueChange: () => {},
});

const Tabs = React.forwardRef(({ value, onValueChange, defaultValue, className, children, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;
  const handleValueChange = isControlled ? onValueChange : setSelectedValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-start gap-1 rounded-lg bg-bg-warm p-1 border border-border-subtle overflow-x-auto',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ value, active, className, onClick, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = active !== undefined ? active : (context.value && value ? context.value === value : false);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (value && context.onValueChange) {
      context.onValueChange(value);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-deep',
        'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-bg-white text-green-deep shadow-sm border border-border-subtle font-semibold'
          : 'text-text-mid hover:text-text-dark hover:bg-bg-white/60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ value, className, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (context.value && value && context.value !== value) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn('mt-4 animate-fade-in', className)}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
