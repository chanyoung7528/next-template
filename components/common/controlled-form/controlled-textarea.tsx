'use client';

import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ControlledTextareaProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  rows?: number;
  maxLength?: number;
}

export function ControlledTextarea<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  description,
  rows = 4,
  maxLength,
}: ControlledTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}은(는) 필수입니다.` : false,
      maxLength: maxLength
        ? {
            value: maxLength,
            message: `최대 ${maxLength}자까지 입력 가능합니다.`,
          }
        : undefined,
    },
  });

  const currentLength = field.value?.length || 0;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Textarea
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full resize-none',
            error && 'border-destructive focus:border-destructive',
            maxLength && 'pr-20'
          )}
          {...field}
        />

        {maxLength && (
          <div className="text-muted-foreground absolute right-2 bottom-2 text-xs">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>

      {description && !error && <p className="text-muted-foreground text-sm">{description}</p>}

      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
}
