'use client';

import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ControlledInputProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function ControlledInput<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  className,
  description,
}: ControlledInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: { required: required ? `${label || name}은(는) 필수입니다.` : false },
  });

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('w-full', error && 'border-destructive focus:border-destructive')}
        {...field}
      />

      {description && !error && <p className="text-muted-foreground text-sm">{description}</p>}

      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
}
