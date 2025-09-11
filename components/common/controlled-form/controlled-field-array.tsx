'use client';

import { GripVertical, Plus, X } from 'lucide-react';
import { ArrayPath, Control, FieldArray, FieldValues, Path, useController, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ControlledFieldArrayProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  description?: string;
  minItems?: number;
  maxItems?: number;
  renderField: (index: number, field: any, remove: (index: number) => void) => React.ReactNode;
  getDefaultValue: () => unknown;
  addButtonText?: string;
  emptyMessage?: string;
}

export function ControlledFieldArray<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  required = false,
  className,
  description,
  minItems,
  maxItems,
  renderField,
  getDefaultValue,
  addButtonText = '추가',
  emptyMessage = '항목이 없습니다.',
}: ControlledFieldArrayProps<T>) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });

  const {
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}은(는) 필수입니다.` : false,
      validate: (value: any[]) => {
        if (minItems && value.length < minItems) {
          return `최소 ${minItems}개의 항목이 필요합니다.`;
        }
        if (maxItems && value.length > maxItems) {
          return `최대 ${maxItems}개까지 추가 가능합니다.`;
        }
        return true;
      },
    },
  });

  const handleAdd = () => {
    if (!maxItems || fields.length < maxItems) {
      append(getDefaultValue() as FieldArray<T, ArrayPath<T>>);
    }
  };

  const handleRemove = (index: number) => {
    if (!minItems || fields.length > minItems) {
      remove(index);
    }
  };

  const canAdd = !maxItems || fields.length < maxItems;
  const canRemove = (index: number) => !minItems || fields.length > minItems;

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
            {maxItems && (
              <span className="text-muted-foreground ml-2 text-xs">
                ({fields.length}/{maxItems})
              </span>
            )}
          </Label>

          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      )}

      <div className="space-y-3">
        {fields.length === 0 && (
          <div className="border-muted-foreground/25 rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-border group hover:border-muted-foreground/50 relative rounded-lg border p-4 transition-colors"
          >
            {/* 순서 변경 핸들 */}
            <div className="absolute top-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground p-1"
                onMouseDown={(e) => e.preventDefault()}
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>

            {/* 삭제 버튼 */}
            {canRemove(index) && (
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* 필드 렌더링 */}
            <div className="pr-12 pl-8">{renderField(index, field, handleRemove)}</div>
          </div>
        ))}
      </div>

      {/* 추가 버튼 */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} disabled={!canAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>

        {fields.length > 0 && <span className="text-muted-foreground text-sm">총 {fields.length}개 항목</span>}
      </div>

      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
}
