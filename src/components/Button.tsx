import clsx from 'clsx';

interface ButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  padding?: 'sm' | 'md';
  status?: 'success' | 'error';
  variant?: 'filled' | 'outlined';
}

export function Button({
  children,
  className,
  status = 'success',
  variant = 'filled',
  padding = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  const paddingClasses = {
    sm: 'py-2 px-4',
    md: 'py-3 px-6',
  }[padding];

  const backgroundClasses = {
    success: 'bg-green-700 hover:bg-green-800',
    error: 'bg-red-700 hover:bg-red-800',
  }[status];

  const borderClasses = {
    filled: 'border-0',
    outlined: 'border border-solid border-slate-700 dark:border-white',
  }[variant];

  return (
    <button
      type={type}
      className={clsx(
        'text-white font-semibold rounded disabled:cursor-not-allowed',
        variant === 'filled' && backgroundClasses,
        borderClasses,
        paddingClasses,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
