'use client';

import { useMemo } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp } from 'lucide-react';
import { Control, FieldValues, useWatch } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CalculationField {
  name: string;
  label: string;
  value: number;
  formatter?: (value: number) => string;
}

interface CalculationSection {
  title: string;
  fields: CalculationField[];
  total?: {
    label: string;
    value: number;
    formatter?: (value: number) => string;
  };
}

interface ControlledRealTimeCalculatorProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  className?: string;
  title?: string;
  description?: string;
  calculations: CalculationSection[];
  grandTotal?: {
    label: string;
    value: number;
    formatter?: (value: number) => string;
  };
  showPercentageBreakdown?: boolean;
}

export function ControlledRealTimeCalculator<T extends FieldValues = FieldValues>({
  control,
  className,
  title = '실시간 계산',
  description,
  calculations,
  grandTotal,
  showPercentageBreakdown = false,
}: ControlledRealTimeCalculatorProps<T>) {
  // 모든 필드 값들을 실시간으로 감시

  // 기본 포매터 함수들
  const formatters = {
    currency: (value: number) => `₩${value.toLocaleString()}`,
    percentage: (value: number) => `${value.toFixed(1)}%`,
    number: (value: number) => value.toLocaleString(),
    decimal: (value: number) => value.toFixed(2),
  };

  // 총합 계산
  const calculatedGrandTotal = useMemo(() => {
    if (grandTotal) {
      return grandTotal.value;
    }
    return calculations.reduce((sum, section) => {
      return sum + (section.total?.value || 0);
    }, 0);
  }, [calculations, grandTotal]);

  // 퍼센티지 분석 계산
  const percentageBreakdown = useMemo(() => {
    if (!showPercentageBreakdown || calculatedGrandTotal === 0) return [];

    return calculations.map((section) => ({
      title: section.title,
      value: section.total?.value || 0,
      percentage: ((section.total?.value || 0) / calculatedGrandTotal) * 100,
    }));
  }, [calculations, calculatedGrandTotal, showPercentageBreakdown]);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="text-primary h-5 w-5" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 계산 섹션들 */}
        {calculations.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{section.title}</h4>

            <div className="bg-muted/30 space-y-2 rounded-lg p-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex items-center justify-between">
                  <span className="text-sm">{field.label}</span>
                  <span className="font-medium">
                    {field.formatter ? field.formatter(field.value) : formatters.currency(field.value)}
                  </span>
                </div>
              ))}

              {section.total && (
                <div className="mt-3 border-t pt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{section.total.label}</span>
                    <span className="text-primary">
                      {section.total.formatter
                        ? section.total.formatter(section.total.value)
                        : formatters.currency(section.total.value)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 총합 */}
        <div className="border-t pt-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="h-5 w-5" />
                {grandTotal?.label || '총액'}
              </span>
              <span className="text-primary text-2xl font-bold">
                {grandTotal?.formatter
                  ? grandTotal.formatter(calculatedGrandTotal)
                  : formatters.currency(calculatedGrandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* 퍼센티지 분석 */}
        {showPercentageBreakdown && percentageBreakdown.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
              <Percent className="h-4 w-4" />
              구성 비율
            </h4>

            <div className="space-y-2">
              {percentageBreakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.title}</span>
                    <span className="font-medium">
                      {formatters.percentage(item.percentage)} ({formatters.currency(item.value)})
                    </span>
                  </div>
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className="from-primary to-primary/60 h-2 rounded-full bg-gradient-to-r transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 통계 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{calculations.length}</div>
            <div className="text-sm text-blue-600/80">카테고리</div>
          </div>

          <div className="rounded-lg bg-green-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
              <TrendingUp className="h-5 w-5" />
              {calculatedGrandTotal > 0 ? '+' : ''}
            </div>
            <div className="text-sm text-green-600/80">실시간 업데이트</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 사전 정의된 계산 유틸리티
export const calculationUtils = {
  // 할인 적용 계산
  applyDiscount: (originalPrice: number, discountRate: number) => {
    return originalPrice * (1 - discountRate / 100);
  },

  // 세금 계산
  calculateTax: (amount: number, taxRate: number) => {
    return amount * (taxRate / 100);
  },

  // 복리 계산
  calculateCompoundInterest: (principal: number, rate: number, time: number, compoundingFrequency: number = 1) => {
    return principal * Math.pow(1 + rate / (100 * compoundingFrequency), compoundingFrequency * time);
  },

  // 월 할부 계산
  calculateMonthlyPayment: (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  },

  // 프로젝트 기간 계산 (일)
  calculateProjectDays: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // ROI 계산
  calculateROI: (gain: number, cost: number) => {
    return ((gain - cost) / cost) * 100;
  },
};
