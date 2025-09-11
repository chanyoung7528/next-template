'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AsyncValidationResult {
  isValid: boolean;
  message?: string;
}

interface ControlledAsyncValidatorProps<T extends FieldValues = FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  asyncValidator: (value: string) => Promise<AsyncValidationResult>;
  debounceMs?: number;
}

export function ControlledAsyncValidator<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  className,
  description,
  asyncValidator,
  debounceMs = 500,
}: ControlledAsyncValidatorProps<T>) {
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [asyncError, setAsyncError] = useState<string>('');

  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<T>,
    control,
    rules: {
      required: required ? `${label || name}은(는) 필수입니다.` : false,
      validate: async (value: string) => {
        if (!value || value.trim() === '') {
          setValidationState('idle');
          setAsyncError('');
          return true;
        }

        setValidationState('validating');

        try {
          // 디바운스를 위한 지연
          await new Promise((resolve) => setTimeout(resolve, debounceMs));

          const result = await asyncValidator(value);

          if (result.isValid) {
            setValidationState('valid');
            setAsyncError('');
            return true;
          } else {
            setValidationState('invalid');
            setAsyncError(result.message || '유효하지 않은 값입니다.');
            return result.message || '유효하지 않은 값입니다.';
          }
        } catch (err) {
          console.error(err);
          setValidationState('invalid');
          setAsyncError('검증 중 오류가 발생했습니다.');
          return '검증 중 오류가 발생했습니다.';
        }
      },
    },
  });

  // 필드 값이 변경될 때마다 상태 초기화
  useEffect(() => {
    if (field.value && field.value.trim() !== '') {
      setValidationState('idle');
      setAsyncError('');
    }
  }, [field.value]);

  const getValidationIcon = () => {
    switch (validationState) {
      case 'validating':
        return <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />;
      case 'valid':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <X className="text-destructive h-4 w-4" />;
      default:
        return null;
    }
  };

  const getInputClassName = () => {
    const baseClasses = 'w-full pr-10';

    if (error || validationState === 'invalid') {
      return cn(baseClasses, 'border-destructive focus:border-destructive');
    }

    if (validationState === 'valid') {
      return cn(baseClasses, 'border-green-500 focus:border-green-500');
    }

    return baseClasses;
  };

  const getValidationMessage = () => {
    if (error) return error.message;
    if (validationState === 'invalid' && asyncError) return asyncError;
    if (validationState === 'valid') return '사용 가능합니다.';
    if (validationState === 'validating') return '확인 중...';
    return null;
  };

  const getMessageClassName = () => {
    if (error || validationState === 'invalid') return 'text-destructive';
    if (validationState === 'valid') return 'text-green-600';
    if (validationState === 'validating') return 'text-muted-foreground';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          {...field}
        />

        {/* 검증 상태 아이콘 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{getValidationIcon()}</div>
      </div>

      {/* 설명 또는 검증 메시지 */}
      {description && validationState === 'idle' && <p className="text-muted-foreground text-sm">{description}</p>}

      {getValidationMessage() && <p className={cn('text-sm', getMessageClassName())}>{getValidationMessage()}</p>}
    </div>
  );
}

// 미리 정의된 비동기 검증 함수들
export const asyncValidators = {
  // 이메일 중복 검사 (모의)
  checkEmailDuplicate: async (email: string): Promise<AsyncValidationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // API 호출 시뮬레이션

    const existingEmails = ['test@example.com', 'admin@test.com', 'user@demo.com'];

    if (existingEmails.includes(email.toLowerCase())) {
      return {
        isValid: false,
        message: '이미 사용 중인 이메일입니다.',
      };
    }

    return {
      isValid: true,
      message: '사용 가능한 이메일입니다.',
    };
  },

  // 사용자명 중복 검사 (모의)
  checkUsernameDuplicate: async (username: string): Promise<AsyncValidationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const existingUsernames = ['admin', 'test', 'user', 'demo'];

    if (username.length < 3) {
      return {
        isValid: false,
        message: '사용자명은 3자 이상이어야 합니다.',
      };
    }

    if (existingUsernames.includes(username.toLowerCase())) {
      return {
        isValid: false,
        message: '이미 사용 중인 사용자명입니다.',
      };
    }

    return {
      isValid: true,
      message: '사용 가능한 사용자명입니다.',
    };
  },

  // 사업자번호 검증 (모의)
  validateBusinessNumber: async (businessNumber: string): Promise<AsyncValidationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // 사업자번호 형식 검증 (XXX-XX-XXXXX)
    const businessNumberRegex = /^\d{3}-\d{2}-\d{5}$/;

    if (!businessNumberRegex.test(businessNumber)) {
      return {
        isValid: false,
        message: '사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)',
      };
    }

    // 모의 API 검증
    const invalidBusinessNumbers = ['123-45-67890', '000-00-00000', '111-11-11111'];

    if (invalidBusinessNumbers.includes(businessNumber)) {
      return {
        isValid: false,
        message: '등록되지 않은 사업자번호입니다.',
      };
    }

    return {
      isValid: true,
      message: '유효한 사업자번호입니다.',
    };
  },

  // 도메인 가용성 검사 (모의)
  checkDomainAvailability: async (domain: string): Promise<AsyncValidationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 도메인 형식 검증
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    if (!domainRegex.test(domain)) {
      return {
        isValid: false,
        message: '올바른 도메인 형식이 아닙니다.',
      };
    }

    // 사용 중인 도메인 목록 (모의)
    const takenDomains = ['google.com', 'facebook.com', 'example.com', 'test.com'];

    if (takenDomains.some((taken) => domain.toLowerCase().includes(taken))) {
      return {
        isValid: false,
        message: '이미 사용 중인 도메인입니다.',
      };
    }

    return {
      isValid: true,
      message: '사용 가능한 도메인입니다.',
    };
  },
};
