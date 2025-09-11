import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';

import {
  ControlledCheckbox,
  ControlledFieldArray,
  ControlledInput,
  ControlledTextarea,
} from '@/components/common/controlled-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExperienceManagementData, experienceManagementSchema } from '@/lib/schema/advanced-form-patterns';

export default function ExperienceManagerComponent() {
  const { control, handleSubmit, watch } = useForm<ExperienceManagementData>({
    resolver: zodResolver(experienceManagementSchema) as Resolver<ExperienceManagementData>,
    defaultValues: {
      personalInfo: {
        name: '',
        title: '',
        summary: '',
      },
      experiences: [
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: '',
          skills: [],
          achievements: [],
        },
      ],
      skills: [],
    },
  });

  const experiences = watch('experiences');
  const totalExperience = experiences?.length || 0;

  const onSubmit = (data: ExperienceManagementData) => {
    console.log('경력 데이터:', data);
    alert('경력 정보가 저장되었습니다!');
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>경력 관리 시스템</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">기본 정보</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledInput name="personalInfo.name" control={control} label="이름" required />
              <ControlledInput name="personalInfo.title" control={control} label="직책" required />
            </div>
            <ControlledTextarea
              name="personalInfo.summary"
              control={control}
              label="간단한 소개"
              placeholder="자신의 전문성과 경험을 간단히 소개해주세요..."
              maxLength={500}
            />
          </div>

          {/* 경력 사항 */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">경력 사항</h3>
            <ControlledFieldArray
              name="experiences"
              control={control}
              minItems={1}
              addButtonText="경력 추가"
              getDefaultValue={() => ({
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: '',
                skills: [],
                achievements: [],
                experiences: [],
                personalInfo: {
                  name: '',
                  title: '',
                  summary: '',
                },
              })}
              renderField={(index) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ControlledInput name={`experiences.${index}.company`} control={control} label="회사명" required />
                    <ControlledInput name={`experiences.${index}.position`} control={control} label="직책" required />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <ControlledInput
                      name={`experiences.${index}.startDate`}
                      control={control}
                      label="시작일"
                      type="text"
                      placeholder="YYYY-MM"
                      required
                    />
                    <ControlledInput
                      name={`experiences.${index}.endDate`}
                      control={control}
                      label="종료일"
                      type="text"
                      placeholder="YYYY-MM"
                      disabled={watch(`experiences.${index}.isCurrent`)}
                    />
                    <div className="flex items-end">
                      <ControlledCheckbox
                        name={`experiences.${index}.isCurrent`}
                        control={control}
                        label="현재 근무 중"
                      />
                    </div>
                  </div>

                  <ControlledTextarea
                    name={`experiences.${index}.description`}
                    control={control}
                    label="업무 설명"
                    placeholder="주요 업무와 성과를 설명해주세요..."
                    maxLength={1000}
                  />

                  {/* 중첩된 성과 배열 */}
                  <ControlledFieldArray
                    name={`experiences.${index}.achievements`}
                    control={control}
                    label="주요 성과"
                    maxItems={5}
                    addButtonText="성과 추가"
                    getDefaultValue={() => ({
                      title: '',
                      description: '',
                      metrics: '',
                      experiences: [],
                      personalInfo: {
                        name: '',
                        title: '',
                        summary: '',
                      },
                    })}
                    renderField={(achievementIndex) => (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <ControlledInput
                          name={`experiences.${index}.achievements.${achievementIndex}.title`}
                          control={control}
                          label="성과 제목"
                          required
                        />
                        <ControlledInput
                          name={`experiences.${index}.achievements.${achievementIndex}.description`}
                          control={control}
                          label="설명"
                        />
                        <ControlledInput
                          name={`experiences.${index}.achievements.${achievementIndex}.metrics`}
                          control={control}
                          label="지표"
                          placeholder="예: 20% 증가"
                        />
                      </div>
                    )}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-muted-foreground text-sm">총 {totalExperience}개의 경력사항이 등록되었습니다.</div>
            <Button type="submit">경력 정보 저장</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export const experienceManagerCode = `// 중첩 배열을 활용한 경력 관리 시스템
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ControlledFieldArray, 
  ControlledInput, 
  ControlledTextarea, 
  ControlledCheckbox 
} from '@/components/common/controlled-form';
import { experienceManagementSchema } from '@/lib/schema/advanced-form-patterns';

function ExperienceManagerExample() {
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(experienceManagementSchema),
    defaultValues: {
      personalInfo: {
        name: '',
        title: '',
        summary: '',
      },
      experiences: [{
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        skills: [],
        achievements: [],
      }],
      skills: [],
    },
  });

  const onSubmit = (data) => {
    console.log('경력 데이터:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledInput name="personalInfo.name" control={control} label="이름" required />
          <ControlledInput name="personalInfo.title" control={control} label="직책" required />
        </div>
        <ControlledTextarea
          name="personalInfo.summary"
          control={control}
          label="간단한 소개"
          maxLength={500}
        />
      </div>

      {/* 경력 사항 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">경력 사항</h3>
        <ControlledFieldArray
          name="experiences"
          control={control}
          minItems={1}
          addButtonText="경력 추가"
          getDefaultValue={() => ({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: '',
            skills: [],
            achievements: [],
          })}
          renderField={(index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ControlledInput
                  name={\`experiences.\${index}.company\`}
                  control={control}
                  label="회사명"
                  required
                />
                <ControlledInput
                  name={\`experiences.\${index}.position\`}
                  control={control}
                  label="직책"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ControlledInput
                  name={\`experiences.\${index}.startDate\`}
                  control={control}
                  label="시작일"
                  placeholder="YYYY-MM"
                  required
                />
                <ControlledInput
                  name={\`experiences.\${index}.endDate\`}
                  control={control}
                  label="종료일"
                  placeholder="YYYY-MM"
                  disabled={watch(\`experiences.\${index}.isCurrent\`)}
                />
                <div className="flex items-end">
                  <ControlledCheckbox
                    name={\`experiences.\${index}.isCurrent\`}
                    control={control}
                    label="현재 근무 중"
                  />
                </div>
              </div>

              <ControlledTextarea
                name={\`experiences.\${index}.description\`}
                control={control}
                label="업무 설명"
                maxLength={1000}
              />

              {/* 중첩된 성과 배열 */}
              <ControlledFieldArray
                name={\`experiences.\${index}.achievements\`}
                control={control}
                label="주요 성과"
                maxItems={5}
                addButtonText="성과 추가"
                getDefaultValue={() => ({
                  title: '',
                  description: '',
                  metrics: '',
                })}
                renderField={(achievementIndex) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ControlledInput
                      name={\`experiences.\${index}.achievements.\${achievementIndex}.title\`}
                      control={control}
                      label="성과 제목"
                      required
                    />
                    <ControlledInput
                      name={\`experiences.\${index}.achievements.\${achievementIndex}.description\`}
                      control={control}
                      label="설명"
                    />
                    <ControlledInput
                      name={\`experiences.\${index}.achievements.\${achievementIndex}.metrics\`}
                      control={control}
                      label="지표"
                      placeholder="예: 20% 증가"
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      </div>

      <Button type="submit">경력 정보 저장</Button>
    </form>
  );
}`;
