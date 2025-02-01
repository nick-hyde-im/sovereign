import clsx from 'clsx';

interface TooltipProps {
  message: string | React.ReactNode;
  children: React.ReactNode;
  show: boolean;
  classes?: string;
}

export function Tooltip({ message, children, show, classes }: TooltipProps) {
  return (
    <div className={clsx('group relative', classes)}>
      {children}
      <span
        className={clsx(
          'absolute -top-14 -translate-x-1/2 scale-0 transition-all cursor-default',
          'rounded bg-slate-900 p-2 text-sm text-center text-white w-40 z-20',
          show && 'group-hover:scale-100',
        )}
      >
        {message}
      </span>
    </div>
  );
}
