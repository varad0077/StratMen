import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NoRecords = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  action = null,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center rounded-xl border border-border bg-surface-dark/50 my-4', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-text-muted mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h4 className="text-lg font-semibold text-text-primary">{title}</h4>
      <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
