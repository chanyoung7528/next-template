import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';

import {
  ControlledCheckbox,
  ControlledFieldArray,
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
  ControlledWizard,
} from '@/components/common/controlled-form';
import {
  BUSINESS_TYPES,
  INDUSTRIES,
  MultiStepCompanySetupData,
  multiStepCompanySetupSchema,
  WORKING_DAYS,
} from '@/lib/schema/advanced-form-patterns';
import { COUNTRIES } from '@/lib/schema/form-controller-examples';

export default function WizardComponent() {
  const { control, trigger } = useForm<MultiStepCompanySetupData>({
    resolver: zodResolver(multiStepCompanySetupSchema) as Resolver<MultiStepCompanySetupData>,
    mode: 'onChange',
    defaultValues: {
      basicInfo: {
        companyName: '',
        businessType: 'corporation',
        industry: '',
        foundedYear: new Date().getFullYear(),
        employees: 1,
      },
      contactInfo: {
        headquarters: {
          country: '',
          city: '',
          address: '',
          postalCode: '',
        },
        contact: {
          phone: '',
          email: '',
          website: '',
        },
      },
      departments: [
        {
          name: '',
          description: '',
          headCount: 1,
          budget: 0,
          teams: [],
        },
      ],
      systemSettings: {
        workingHours: {
          startTime: '09:00',
          endTime: '18:00',
          workingDays: [],
        },
        holidays: [],
        policies: {
          vacationPolicy: '',
          remoteWorkPolicy: false,
          overtimePolicy: '',
        },
      },
    },
  });

  const steps = [
    {
      id: 'basic',
      title: '기본 정보',
      description: '회사의 기본 정보를 입력해주세요.',
      validation: async () => {
        const result = await trigger(['basicInfo']);
        return result;
      },
      content: (
        <div className="space-y-4">
          <ControlledInput name="basicInfo.companyName" control={control} label="회사명" required />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ControlledSelect
              name="basicInfo.businessType"
              control={control}
              label="사업 유형"
              options={BUSINESS_TYPES}
              required
            />
            <ControlledSelect name="basicInfo.industry" control={control} label="업종" options={INDUSTRIES} required />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ControlledInput name="basicInfo.foundedYear" control={control} label="설립년도" type="text" required />
            <ControlledInput name="basicInfo.employees" control={control} label="직원 수" type="text" required />
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: '연락처 정보',
      description: '회사의 주소와 연락처를 입력해주세요.',
      validation: async () => {
        const result = await trigger(['contactInfo']);
        return result;
      },
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">본사 주소</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledSelect
                name="contactInfo.headquarters.country"
                control={control}
                label="국가"
                options={COUNTRIES}
                required
              />
              <ControlledInput name="contactInfo.headquarters.city" control={control} label="도시" required />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <ControlledInput name="contactInfo.headquarters.address" control={control} label="주소" required />
              </div>
              <ControlledInput name="contactInfo.headquarters.postalCode" control={control} label="우편번호" required />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">연락처</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledInput name="contactInfo.contact.phone" control={control} label="전화번호" required />
              <ControlledInput
                name="contactInfo.contact.email"
                control={control}
                label="이메일"
                type="email"
                required
              />
            </div>
            <ControlledInput name="contactInfo.contact.website" control={control} label="웹사이트" />
          </div>
        </div>
      ),
    },
    {
      id: 'departments',
      title: '부서 구조',
      description: '회사의 부서와 팀 구조를 설정해주세요.',
      validation: async () => {
        const result = await trigger(['departments']);
        return result;
      },
      content: (
        <ControlledFieldArray
          name="departments"
          control={control}
          label="부서 목록"
          minItems={1}
          maxItems={20}
          addButtonText="부서 추가"
          getDefaultValue={() => {
            return {
              name: '',
              description: '',
              headCount: 1,
              budget: 0,
              teams: [],
            };
          }}
          renderField={(index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ControlledInput name={`departments.${index}.name`} control={control} label="부서명" required />
                <ControlledInput
                  name={`departments.${index}.headCount`}
                  control={control}
                  label="인원 수"
                  type="text"
                  required
                />
              </div>
              <ControlledTextarea name={`departments.${index}.description`} control={control} label="부서 설명" />
            </div>
          )}
        />
      ),
    },
    {
      id: 'system',
      title: '시스템 설정',
      description: '근무 시간과 정책을 설정해주세요.',
      validation: async () => {
        const result = await trigger(['systemSettings']);
        return result;
      },
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">근무 시간</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledInput
                name="systemSettings.workingHours.startTime"
                control={control}
                label="시작 시간"
                required
              />
              <ControlledInput
                name="systemSettings.workingHours.endTime"
                control={control}
                label="종료 시간"
                required
              />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">근무일</h4>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {WORKING_DAYS.map((day) => (
                <ControlledCheckbox
                  key={day.value}
                  name="systemSettings.workingHours.workingDays"
                  control={control}
                  label={day.label}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">정책</h4>
            <ControlledCheckbox
              name="systemSettings.policies.remoteWorkPolicy"
              control={control}
              label="원격 근무 허용"
            />
            <ControlledTextarea
              name="systemSettings.policies.vacationPolicy"
              control={control}
              label="휴가 정책"
              maxLength={1000}
            />
          </div>
        </div>
      ),
    },
  ];

  const onComplete = (data: MultiStepCompanySetupData) => {
    console.log('회사 설정 데이터:', data);
    alert('회사 설정이 완료되었습니다!');
  };

  return (
    <div className="w-full max-w-4xl">
      <ControlledWizard
        steps={steps}
        control={control}
        onComplete={onComplete}
        completionTitle="설정 완료"
        completionDescription="회사 설정이 성공적으로 완료되었습니다!"
        showProgress
      />
    </div>
  );
}
