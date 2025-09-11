'use client';

import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ControlledCheckboxGroupProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  options: CheckboxOption[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  minSelection?: number;
  maxSelection?: number;
}

export function ControlledCheckboxGroup<T extends FieldValues = FieldValues>({
  name,
  control,
  options,
  label,
  required = false,
  disabled = false,
  className,
  description,
  minSelection,
  maxSelection,
}: ControlledCheckboxGroupProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}에서 최소 1개를 선택해주세요.` : false,
      validate: (value: string[] = []) => {
        if (minSelection && value.length < minSelection) {
          return `최소 ${minSelection}개를 선택해주세요.`;
        }
        if (maxSelection && value.length > maxSelection) {
          return `최대 ${maxSelection}개까지 선택 가능합니다.`;
        }
        return true;
      },
    },
  });

  const selectedValues = field.value || [];

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    let newValues: string[];

    if (checked) {
      newValues = [...selectedValues, optionValue];
    } else {
      newValues = selectedValues.filter((value: string) => value !== optionValue);
    }

    field.onChange(newValues);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {maxSelection && (
            <span className="text-muted-foreground ml-2 text-xs">
              ({selectedValues.length}/{maxSelection})
            </span>
          )}
        </Label>
      )}

      <div className="space-y-2">
        {options.map((option) => {
          const optionValue = option?.value ?? '';
          const isChecked = (selectedValues as string[]).includes(optionValue);
          const isDisabled =
            disabled ||
            option.disabled ||
            (maxSelection !== undefined && !isChecked && (selectedValues as string[]).length >= maxSelection);

          return (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${name}-${option.value}`}
                checked={isChecked}
                onCheckedChange={(checked) => handleOptionChange(option.value, !!checked)}
                disabled={isDisabled || false}
                className={cn(error && 'border-destructive')}
              />

              <Label
                htmlFor={`${name}-${option.value}`}
                className={cn('cursor-pointer text-sm', isDisabled && 'cursor-not-allowed opacity-50')}
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>

      {description && !error && <p className="text-muted-foreground text-sm">{description}</p>}

      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
}
