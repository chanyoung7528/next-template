'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Control, FieldValues, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validation?: (data: any) => boolean | string | Promise<boolean | string>;
  skipIf?: (data: any) => boolean;
}

interface ControlledWizardProps<T extends FieldValues = FieldValues> {
  steps: WizardStep[];
  control: Control<T>;
  onComplete: (data: T) => void;
  onStepChange?: (currentStep: number) => void;
  className?: string;
  completionTitle?: string;
  completionDescription?: string;
  showProgress?: boolean;
  validateStep?: (stepId: string, data: T) => Promise<boolean>;
}

export function ControlledWizard<T extends FieldValues = FieldValues>({
  steps,
  control,
  onComplete,
  onStepChange,
  className,
  completionTitle = '완료',
  completionDescription = '모든 단계가 완료되었습니다.',
  showProgress = true,
}: ControlledWizardProps<T>) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepValidationState, setStepValidationState] = useState<Record<number, boolean>>({});
  const [stepValidationError, setStepValidationError] = useState<Record<number, string | null>>({});

  // useRef로 마지막 watchedData를 저장 (onComplete에서 최신값 보장)
  const watchedData = useWatch({ control });
  const watchedDataRef = useRef(watchedData);
  useEffect(() => {
    watchedDataRef.current = watchedData;
  }, [watchedData]);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  // 유효성 검사 상태 업데이트
  useEffect(() => {
    const validateCurrentStep = async () => {
      const step = steps[currentStepIndex];
      if (step.validation) {
        try {
          const result = await step.validation(watchedData);
          if (typeof result === 'string') {
            setStepValidationState((prev) => ({
              ...prev,
              [currentStepIndex]: false,
            }));
            setStepValidationError((prev) => ({
              ...prev,
              [currentStepIndex]: result,
            }));
          } else {
            setStepValidationState((prev) => ({
              ...prev,
              [currentStepIndex]: result === true,
            }));
            setStepValidationError((prev) => ({
              ...prev,
              [currentStepIndex]: null,
            }));
          }
        } catch (error) {
          setStepValidationState((prev) => ({
            ...prev,
            [currentStepIndex]: false,
          }));
          setStepValidationError((prev) => ({
            ...prev,
            [currentStepIndex]: '이 단계를 완료하려면 모든 필수 필드를 올바르게 입력해주세요.',
          }));
        }
      } else {
        setStepValidationState((prev) => ({
          ...prev,
          [currentStepIndex]: true,
        }));
        setStepValidationError((prev) => ({
          ...prev,
          [currentStepIndex]: null,
        }));
      }
    };

    validateCurrentStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedData, currentStepIndex, steps]);

  const isStepValid = (stepIndex: number) => {
    return stepValidationState[stepIndex] ?? false;
  };

  const getStepValidationError = (stepIndex: number) => {
    return stepValidationError[stepIndex] ?? null;
  };

  const shouldSkipStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    return step.skipIf ? step.skipIf(watchedData) : false;
  };

  const getValidSteps = () => {
    return steps.filter((_, index) => !shouldSkipStep(index));
  };

  const getValidStepIndex = (stepIndex: number) => {
    const validSteps = getValidSteps();
    return validSteps.findIndex((_, index) => {
      const originalIndex = steps.findIndex((step) => step === validSteps[index]);
      return originalIndex === stepIndex;
    });
  };

  const goToNextStep = () => {
    if (!isStepValid(currentStepIndex)) return;

    setCompletedSteps((prev) => new Set(prev).add(currentStepIndex));

    let nextIndex = currentStepIndex + 1;

    // 건너뛸 스텝들을 찾기
    while (nextIndex < totalSteps && shouldSkipStep(nextIndex)) {
      nextIndex++;
    }

    if (nextIndex >= totalSteps) {
      setIsCompleted(true);
      // 최신 watchedData 사용
      onComplete(watchedDataRef.current as T);
    } else {
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex);
    }
  };

  const goToPreviousStep = () => {
    let prevIndex = currentStepIndex - 1;

    // 건너뛸 스텝들을 찾기
    while (prevIndex >= 0 && shouldSkipStep(prevIndex)) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
      onStepChange?.(prevIndex);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (shouldSkipStep(stepIndex)) return;

    // 이전 스텝들이 모두 완료되었는지 확인
    let canNavigate = true;
    for (let i = 0; i < stepIndex; i++) {
      if (!shouldSkipStep(i) && !completedSteps.has(i) && !isStepValid(i)) {
        canNavigate = false;
        break;
      }
    }

    if (canNavigate) {
      setCurrentStepIndex(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  const validSteps = getValidSteps();
  const currentValidIndex = getValidStepIndex(currentStepIndex);

  if (isCompleted) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="pt-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{completionTitle}</h3>
              <p className="text-muted-foreground">{completionDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      {showProgress && (
        <CardHeader className="pb-3">
          {/* 진행률 표시 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행률</span>
              <span>
                {currentValidIndex + 1} / {validSteps.length}
              </span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentValidIndex + 1) / validSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 스텝 네비게이션 */}
          <div className="flex justify-center space-x-2 pt-2">
            {steps.map((step, index) => {
              if (shouldSkipStep(index)) return null;

              const isActive = index === currentStepIndex;
              const isCompleted = completedSteps.has(index);
              const isClickable = index <= currentStepIndex || completedSteps.has(index);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  disabled={!isClickable}
                  className={cn(
                    'h-8 w-8 rounded-full text-xs font-medium transition-colors',
                    'flex items-center justify-center border-2',
                    {
                      'bg-primary text-primary-foreground border-primary': isActive,
                      'border-green-200 bg-green-100 text-green-600': isCompleted && !isActive,
                      'bg-muted text-muted-foreground border-muted': !isActive && !isCompleted,
                      'hover:bg-primary/10 cursor-pointer': isClickable && !isActive,
                      'cursor-not-allowed opacity-50': !isClickable,
                    }
                  )}
                >
                  {isCompleted && !isActive ? <Check className="h-4 w-4" /> : getValidStepIndex(index) + 1}
                </button>
              );
            })}
          </div>
        </CardHeader>
      )}

      <CardHeader className={showProgress ? 'pt-0' : undefined}>
        <CardTitle>{currentStep.title}</CardTitle>
        {currentStep.description && <CardDescription>{currentStep.description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 현재 스텝 콘텐츠 */}
        <div>{currentStep.content}</div>

        {/* 유효성 검사 에러 */}
        {currentStep.validation && !isStepValid(currentStepIndex) && (
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
            <p className="text-destructive text-sm">
              {getStepValidationError(currentStepIndex) ||
                '이 단계를 완료하려면 모든 필수 필드를 올바르게 입력해주세요.'}
            </p>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <Button type="button" onClick={goToNextStep} disabled={!isStepValid(currentStepIndex)} className="gap-2">
            {currentStepIndex === totalSteps - 1 ? '완료' : '다음'}
            {currentStepIndex !== totalSteps - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
