'use client';

import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ControlledCheckboxProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function ControlledCheckbox<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  className,
  description,
}: ControlledCheckboxProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}에 동의해주세요.` : false,
    },
  });

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-2">
        <Checkbox
          id={name}
          checked={field.value || false}
          onCheckedChange={field.onChange}
          disabled={disabled}
          className={cn('mt-0.5', error && 'border-destructive')}
        />

        {label && (
          <Label
            htmlFor={name}
            className={cn('cursor-pointer text-sm font-medium', disabled && 'cursor-not-allowed opacity-50')}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>

      {description && !error && <p className="text-muted-foreground ml-6 text-sm">{description}</p>}

      {error && <p className="text-destructive ml-6 text-sm">{error.message}</p>}
    </div>
  );
}
