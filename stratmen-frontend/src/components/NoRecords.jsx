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
    <div className={cn('flex flex-col items-center justify-center p-10 text-center rounded-xl border border-border-subtle bg-bg-white my-4', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green-deep mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="text-base font-semibold text-text-dark">{title}</h4>
      <p className="mt-1.5 text-sm text-text-mid max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
