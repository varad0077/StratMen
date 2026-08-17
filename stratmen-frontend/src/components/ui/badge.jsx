import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        // Default: soft green (not neon) — used for status, frequency tags
        default: 'border-transparent bg-green-soft text-green-deep',
        // Secondary: neutral light grey
        secondary: 'border-transparent bg-[#F0F2EF] text-text-mid',
        // Outline: subtle border
        outline: 'border-border-subtle text-text-mid bg-transparent',
        // Destructive / error
        destructive: 'border-transparent bg-danger/10 text-danger',
        // Success
        success: 'border-transparent bg-success/10 text-success',
        // Warning
        warning: 'border-transparent bg-warning/10 text-warning',
        // Admin / elevated role
        admin: 'border-transparent bg-green-soft text-green-deep border border-green-deep/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
