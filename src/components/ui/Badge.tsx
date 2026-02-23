import { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-tertiary text-text-secondary border-border',
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  error: 'bg-error/20 text-error border-error/30',
  info: 'bg-accent-alt/20 text-accent-alt border-accent-alt/30',
  outline: 'bg-transparent text-text-secondary border-border',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  pulse = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-md border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

// Convenience components for common badge types
export function StatusBadge({ 
  status, 
  ...props 
}: { status: 'active' | 'idle' | 'offline' | 'error' } & Omit<BadgeProps, 'variant' | 'children'>) {
  const config = {
    active: { variant: 'success' as const, label: 'Active', pulse: true },
    idle: { variant: 'warning' as const, label: 'Idle', pulse: false },
    offline: { variant: 'default' as const, label: 'Offline', pulse: false },
    error: { variant: 'error' as const, label: 'Error', pulse: true },
  };
  
  const { variant, label, pulse } = config[status];
  
  return (
    <Badge variant={variant} pulse={pulse} {...props}>
      {label}
    </Badge>
  );
}

export function SkillBadge({ 
  name, 
  ...props 
}: { name: string } & Omit<BadgeProps, 'children'>) {
  return (
    <Badge variant="outline" {...props}>
      {name}
    </Badge>
  );
}
