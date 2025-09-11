import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';

import {
  calculationUtils,
  ControlledCheckbox,
  ControlledFieldArray,
  ControlledInput,
  ControlledRealTimeCalculator,
  ControlledSelect,
} from '@/components/common/controlled-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RealTimeCalculationData,
  realTimeCalculationSchema,
  SERVICE_CATEGORIES,
} from '@/lib/schema/advanced-form-patterns';

export default function QuoteCalculatorComponent() {
  const { control, handleSubmit, watch } = useForm<RealTimeCalculationData>({
    resolver: zodResolver(realTimeCalculationSchema) as Resolver<RealTimeCalculationData>,
    defaultValues: {
      projectInfo: {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
      },
      services: [
        {
          category: 'development',
          service: 'web_development',
          quantity: 1,
          unitPrice: 1000000,
          discount: 0,
          taxRate: 10,
        },
      ],
      additionalOptions: {
        expediteFee: false,
        expediteFeeRate: 20,
        supportPackage: false,
        supportPackageRate: 15,
        warrantyCoverage: false,
        warrantyCoverageRate: 5,
      },
      clientInfo: {
        isVip: false,
        vipDiscountRate: 5,
        loyaltyPoints: 0,
        pointsRedemptionRate: 0.1,
      },
    },
  });

  const watchedValues = watch();
  const services = watchedValues.services || [];
  const additionalOptions = watchedValues.additionalOptions || {};
  const clientInfo = watchedValues.clientInfo || {};
  const projectInfo = watchedValues.projectInfo || {};

  // 실시간 계산
  const calculations = [
    {
      title: '기본 서비스',
      fields: services.map((service, index) => {
        const subtotal = service.quantity * service.unitPrice;
        const discountAmount = subtotal * (service.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * (service.taxRate / 100);
        return {
          name: `service-${index}`,
          label: `${SERVICE_CATEGORIES.find((cat) => cat.value === service.category)?.label} - ${
            SERVICE_CATEGORIES.find((cat) => cat.value === service.category)?.services.find(
              (s) => s.value === service.service
            )?.label
          }`,
          value: afterDiscount + taxAmount,
        };
      }),
      total: {
        label: '서비스 소계',
        value: services.reduce((sum, service) => {
          const subtotal = service.quantity * service.unitPrice;
          const discountAmount = subtotal * (service.discount / 100);
          const afterDiscount = subtotal - discountAmount;
          const taxAmount = afterDiscount * (service.taxRate / 100);
          return sum + afterDiscount + taxAmount;
        }, 0),
      },
    },
    {
      title: '추가 옵션',
      fields: [
        {
          name: 'expedite',
          label: '긴급 처리비',
          value: additionalOptions.expediteFee
            ? (services.reduce((sum, service) => {
                const subtotal = service.quantity * service.unitPrice;
                const discountAmount = subtotal * (service.discount / 100);
                return sum + subtotal - discountAmount;
              }, 0) *
                additionalOptions.expediteFeeRate) /
              100
            : 0,
        },
        {
          name: 'support',
          label: '지원 패키지',
          value: additionalOptions.supportPackage
            ? (services.reduce((sum, service) => {
                const subtotal = service.quantity * service.unitPrice;
                const discountAmount = subtotal * (service.discount / 100);
                return sum + subtotal - discountAmount;
              }, 0) *
                additionalOptions.supportPackageRate) /
              100
            : 0,
        },
        {
          name: 'warranty',
          label: '보증 연장',
          value: additionalOptions.warrantyCoverage
            ? (services.reduce((sum, service) => {
                const subtotal = service.quantity * service.unitPrice;
                const discountAmount = subtotal * (service.discount / 100);
                return sum + subtotal - discountAmount;
              }, 0) *
                additionalOptions.warrantyCoverageRate) /
              100
            : 0,
        },
      ],
      total: {
        label: '옵션 소계',
        value:
          (additionalOptions.expediteFee
            ? (services.reduce((sum, service) => {
                const subtotal = service.quantity * service.unitPrice;
                const discountAmount = subtotal * (service.discount / 100);
                return sum + subtotal - discountAmount;
              }, 0) *
                additionalOptions.expediteFeeRate) /
              100
            : 0) +
          (additionalOptions.supportPackage
            ? (services.reduce((sum, service) => {
                const subtotal = service.quantity * service.unitPrice;
                const discountAmount = subtotal * (service.discount / 100);
                return sum + subtotal - discountAmount;
              }, 0) *
                additionalOptions.supportPackageRate) /
              100
            : 0) +
          (additionalOptions.warrantyCoverage
            ? (services.reduce((sum, service) => {
                const subtotal = service.quantity * service.unitPrice;
                const discountAmount = subtotal * (service.discount / 100);
                return sum + subtotal - discountAmount;
              }, 0) *
                additionalOptions.warrantyCoverageRate) /
              100
            : 0),
      },
    },
  ];

  const onSubmit = (data: RealTimeCalculationData) => {
    console.log('견적 데이터:', data);
    alert('견적서가 생성되었습니다!');
  };

  const projectDays =
    projectInfo.startDate && projectInfo.endDate
      ? calculationUtils.calculateProjectDays(projectInfo.startDate, projectInfo.endDate)
      : 0;

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 폼 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 견적 요청</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-semibold">프로젝트 정보</h3>
              <ControlledInput name="projectInfo.name" control={control} label="프로젝트명" required />
              <div className="grid grid-cols-2 gap-4">
                <ControlledInput
                  name="projectInfo.startDate"
                  control={control}
                  label="시작일"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  required
                />
                <ControlledInput
                  name="projectInfo.endDate"
                  control={control}
                  label="종료일"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  required
                />
              </div>
              {projectDays > 0 && <p className="text-sm text-blue-600">예상 프로젝트 기간: {projectDays}일</p>}
            </div>

            <div className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-semibold">서비스</h3>
              <ControlledFieldArray
                name="services"
                control={control}
                minItems={1}
                maxItems={5}
                addButtonText="서비스 추가"
                getDefaultValue={() => ({
                  category: 'development',
                  service: 'web_development',
                  quantity: 1,
                  unitPrice: 1000000,
                  discount: 0,
                  taxRate: 10,

                  projectInfo: {
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                  },
                  additionalOptions: {
                    expediteFee: false,
                    expediteFeeRate: 20,
                    supportPackage: false,
                    supportPackageRate: 15,
                    warrantyCoverage: false,
                    warrantyCoverageRate: 5,
                  },
                  clientInfo: {
                    isVip: false,
                    vipDiscountRate: 5,
                    loyaltyPoints: 0,
                    pointsRedemptionRate: 0.1,
                  },
                  services: [],
                })}
                renderField={(index) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <ControlledSelect
                        name={`services.${index}.category`}
                        control={control}
                        label="카테고리"
                        options={SERVICE_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label }))}
                        required
                      />
                      <ControlledSelect
                        name={`services.${index}.service`}
                        control={control}
                        label="서비스"
                        options={
                          SERVICE_CATEGORIES.find(
                            (cat) => cat.value === watch(`services.${index}.category`)
                          )?.services.map((service) => ({
                            value: service.value,
                            label: service.label,
                          })) || []
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <ControlledInput
                        name={`services.${index}.quantity`}
                        control={control}
                        label="수량"
                        type="text"
                        required
                      />
                      <ControlledInput
                        name={`services.${index}.unitPrice`}
                        control={control}
                        label="단가"
                        type="text"
                        required
                      />
                      <ControlledInput
                        name={`services.${index}.discount`}
                        control={control}
                        label="할인율(%)"
                        type="text"
                      />
                      <ControlledInput
                        name={`services.${index}.taxRate`}
                        control={control}
                        label="세율(%)"
                        type="text"
                      />
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-semibold">추가 옵션</h3>
              <div className="space-y-3">
                <ControlledCheckbox
                  name="additionalOptions.expediteFee"
                  control={control}
                  label={`긴급 처리 (+${additionalOptions.expediteFeeRate}%)`}
                />
                <ControlledCheckbox
                  name="additionalOptions.supportPackage"
                  control={control}
                  label={`지원 패키지 (+${additionalOptions.supportPackageRate}%)`}
                />
                <ControlledCheckbox
                  name="additionalOptions.warrantyCoverage"
                  control={control}
                  label={`보증 연장 (+${additionalOptions.warrantyCoverageRate}%)`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-semibold">고객 정보</h3>
              <ControlledCheckbox
                name="clientInfo.isVip"
                control={control}
                label={`VIP 고객 (-${clientInfo.vipDiscountRate}% 할인)`}
              />
            </div>

            <Button type="submit" className="w-full">
              견적서 생성
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 실시간 계산 섹션 */}
      <ControlledRealTimeCalculator
        control={control}
        title="견적 계산서"
        description="입력 내용에 따라 실시간으로 계산됩니다."
        calculations={calculations}
        showPercentageBreakdown
      />
    </div>
  );
}

export const quoteCalculatorCode = `// 실시간 견적 계산기
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ControlledInput, 
  ControlledFieldArray, 
  ControlledSelect, 
  ControlledCheckbox,
  ControlledRealTimeCalculator,
  calculationUtils 
} from '@/components/common/controlled-form';
import { realTimeCalculationSchema, SERVICE_CATEGORIES } from '@/lib/schema/advanced-form-patterns';

function RealTimeQuoteCalculator() {
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(realTimeCalculationSchema),
    defaultValues: {
      projectInfo: {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
      },
      services: [{
        category: 'development',
        service: 'web_development',
        quantity: 1,
        unitPrice: 1000000,
        discount: 0,
        taxRate: 10,
      }],
      additionalOptions: {
        expediteFee: false,
        expediteFeeRate: 20,
        supportPackage: false,
        supportPackageRate: 15,
        warrantyCoverage: false,
        warrantyCoverageRate: 5,
      },
      clientInfo: {
        isVip: false,
        vipDiscountRate: 5,
        loyaltyPoints: 0,
        pointsRedemptionRate: 0.1,
      },
    },
  });

  const watchedValues = watch();
  const services = watchedValues.services || [];
  const additionalOptions = watchedValues.additionalOptions || {};
  const projectInfo = watchedValues.projectInfo || {};

  // 실시간 계산 로직
  const calculations = [
    {
      title: '기본 서비스',
      fields: services.map((service, index) => {
        const subtotal = service.quantity * service.unitPrice;
        const discountAmount = subtotal * (service.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * (service.taxRate / 100);
        return {
          name: \`service-\${index}\`,
          label: \`서비스 \${index + 1}\`,
          value: afterDiscount + taxAmount,
        };
      }),
      total: {
        label: '서비스 소계',
        value: services.reduce((sum, service) => {
          const subtotal = service.quantity * service.unitPrice;
          const discountAmount = subtotal * (service.discount / 100);
          const afterDiscount = subtotal - discountAmount;
          const taxAmount = afterDiscount * (service.taxRate / 100);
          return sum + afterDiscount + taxAmount;
        }, 0),
      },
    },
    {
      title: '추가 옵션',
      fields: [
        {
          name: 'expedite',
          label: '긴급 처리비',
          value: additionalOptions.expediteFee ? 
            (services.reduce((sum, service) => sum + service.quantity * service.unitPrice, 0) * additionalOptions.expediteFeeRate / 100) : 0,
        },
        {
          name: 'support',
          label: '지원 패키지',
          value: additionalOptions.supportPackage ? 
            (services.reduce((sum, service) => sum + service.quantity * service.unitPrice, 0) * additionalOptions.supportPackageRate / 100) : 0,
        },
      ],
    },
  ];

  const onSubmit = (data) => {
    console.log('견적 데이터:', data);
  };

  const projectDays = projectInfo.startDate && projectInfo.endDate 
    ? calculationUtils.calculateProjectDays(projectInfo.startDate, projectInfo.endDate)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 폼 섹션 */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">프로젝트 정보</h3>
              <ControlledInput 
                name="projectInfo.name" 
                control={control} 
                label="프로젝트명" 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <ControlledInput
                  name="projectInfo.startDate"
                  control={control}
                  label="시작일"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  required
                />
                <ControlledInput
                  name="projectInfo.endDate"
                  control={control}
                  label="종료일"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  required
                />
              </div>
              {projectDays > 0 && (
                <p className="text-sm text-blue-600">예상 프로젝트 기간: {projectDays}일</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">서비스</h3>
              <ControlledFieldArray
                name="services"
                control={control}
                minItems={1}
                maxItems={5}
                addButtonText="서비스 추가"
                getDefaultValue={() => ({
                  category: 'development',
                  service: 'web_development',
                  quantity: 1,
                  unitPrice: 1000000,
                  discount: 0,
                  taxRate: 10,
                })}
                renderField={(index) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <ControlledSelect
                        name={\`services.\${index}.category\`}
                        control={control}
                        label="카테고리"
                        options={SERVICE_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))}
                        required
                      />
                      <ControlledInput
                        name={\`services.\${index}.quantity\`}
                        control={control}
                        label="수량"
                        type="text"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <ControlledInput
                        name={\`services.\${index}.unitPrice\`}
                        control={control}
                        label="단가"
                        type="text"
                        required
                      />
                      <ControlledInput
                        name={\`services.\${index}.discount\`}
                        control={control}
                        label="할인율(%)"
                        type="text"
                      />
                      <ControlledInput
                        name={\`services.\${index}.taxRate\`}
                        control={control}
                        label="세율(%)"
                        type="text"
                      />
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">추가 옵션</h3>
              <ControlledCheckbox
                name="additionalOptions.expediteFee"
                control={control}
                label={\`긴급 처리 (+\${additionalOptions.expediteFeeRate}%)\`}
              />
              <ControlledCheckbox
                name="additionalOptions.supportPackage"
                control={control}
                label={\`지원 패키지 (+\${additionalOptions.supportPackageRate}%)\`}
              />
            </div>

            <Button type="submit" className="w-full">견적서 생성</Button>
          </form>
        </CardContent>
      </Card>

      {/* 실시간 계산 섹션 */}
      <ControlledRealTimeCalculator
        control={control}
        title="견적 계산서"
        description="입력 내용에 따라 실시간으로 계산됩니다."
        calculations={calculations}
        showPercentageBreakdown
      />
    </div>
  );
}`;
