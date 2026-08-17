import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-deep focus-visible:ring-offset-2 focus-visible:ring-offset-bg-warm disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // Deep professional green — primary actions
        default: 'bg-green-deep text-white hover:bg-[#274a38] shadow-sm hover:shadow-card',
        // Danger / destructive
        destructive: 'bg-danger text-white hover:bg-danger-hover',
        // Subtle outlined — secondary actions
        outline: 'border border-border-subtle bg-bg-white text-text-dark hover:bg-green-soft hover:border-border-mid',
        // Soft green — selected / secondary states
        secondary: 'bg-green-soft text-green-deep hover:bg-[#d3eadb]',
        // Ghost — tertiary / icon actions
        ghost: 'text-text-mid hover:text-text-dark hover:bg-green-soft',
        // Inline link
        link: 'text-green-deep underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
