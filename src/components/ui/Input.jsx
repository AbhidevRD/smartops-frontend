import { cn } from '@/lib/utils';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-lg',
        'text-gray-900 placeholder-gray-500',
        'focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900',
        'dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400',
        'dark:focus:border-white dark:focus:ring-white',
        'transition-colors',
        className
      )}
      {...props}
    />
  );
}
