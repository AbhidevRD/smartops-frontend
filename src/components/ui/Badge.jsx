import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', size = 'md', children, ...props }) {
  const variants = {
    default: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white',
    primary: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    success: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={cn(
        'inline-block font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
