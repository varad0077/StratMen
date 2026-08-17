import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Loader = ({ className, size = 'default', text = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    default: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <motion.div
        className={cn(
          'rounded-full border-border-subtle border-t-green-deep',
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p className="text-sm text-text-mid">{text}</p>
      )}
    </div>
  );
};

/**
 * Full-page centered loader.
 */
const PageLoader = ({ text = 'Loading...' }) => (
  <div className="flex h-[60vh] items-center justify-center bg-bg-warm">
    <Loader size="lg" text={text} />
  </div>
);

export { Loader, PageLoader };
