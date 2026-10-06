import { cn } from '@/lib/utils'

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  error?: string
  hint?: string
}

export function Field({ label, name, error, hint, className, ...props }: FieldProps) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'h-12 rounded-md border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/30 [color-scheme:dark]',
          error && 'border-destructive',
        )}
        {...props}
      />
      {error ? (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
