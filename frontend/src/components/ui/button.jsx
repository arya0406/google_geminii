import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});