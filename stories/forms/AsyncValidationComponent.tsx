import { useForm } from 'react-hook-form';

import { asyncValidators, ControlledAsyncValidator } from '@/components/common/controlled-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AsyncValidationComponent() {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      businessNumber: '',
      domain: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('검증된 데이터:', data);
    alert('모든 검증이 완료되어 계정이 생성되었습니다!');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>비동기 유효성 검사 예제</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ControlledAsyncValidator
            name="email"
            control={control}
            label="이메일"
            type="email"
            placeholder="example@email.com"
            required
            asyncValidator={asyncValidators.checkEmailDuplicate}
            description="이메일 중복 검사가 실시간으로 수행됩니다."
            debounceMs={800}
          />

          <ControlledAsyncValidator
            name="username"
            control={control}
            label="사용자명"
            placeholder="영문, 숫자 조합 3자 이상"
            required
            asyncValidator={asyncValidators.checkUsernameDuplicate}
            description="사용자명 중복 검사 및 형식 검증이 수행됩니다."
          />

          <ControlledAsyncValidator
            name="businessNumber"
            control={control}
            label="사업자번호"
            placeholder="123-45-67890"
            asyncValidator={asyncValidators.validateBusinessNumber}
            description="국세청 사업자번호 검증 API를 통해 확인됩니다."
          />

          <ControlledAsyncValidator
            name="domain"
            control={control}
            label="도메인"
            placeholder="example.com"
            asyncValidator={asyncValidators.checkDomainAvailability}
            description="도메인 사용 가능 여부를 실시간으로 확인합니다."
            debounceMs={1000}
          />

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-800">테스트 시나리오</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• 이메일: test@example.com (중복), admin@test.com (중복)</li>
              <li>• 사용자명: admin, test, user, demo (중복)</li>
              <li>• 사업자번호: 123-45-67890 (무효), 올바른 형식 사용</li>
              <li>• 도메인: google.com, facebook.com (사용중)</li>
            </ul>
          </div>

          <Button type="submit" className="w-full">
            계정 생성
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export const asyncValidationCode = `// 비동기 유효성 검사 예제
import { useForm } from 'react-hook-form';
import { ControlledAsyncValidator, asyncValidators } from '@/components/common/controlled-form';

function AsyncValidationExample() {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      businessNumber: '',
      domain: '',
    },
  });

  const onSubmit = (data) => {
    console.log('검증된 데이터:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ControlledAsyncValidator
        name="email"
        control={control}
        label="이메일"
        type="email"
        placeholder="example@email.com"
        required
        asyncValidator={asyncValidators.checkEmailDuplicate}
        description="이메일 중복 검사가 실시간으로 수행됩니다."
        debounceMs={800}
      />

      <ControlledAsyncValidator
        name="username"
        control={control}
        label="사용자명"
        placeholder="영문, 숫자 조합 3자 이상"
        required
        asyncValidator={asyncValidators.checkUsernameDuplicate}
        description="사용자명 중복 검사 및 형식 검증이 수행됩니다."
      />

      <ControlledAsyncValidator
        name="businessNumber"
        control={control}
        label="사업자번호"
        placeholder="123-45-67890"
        asyncValidator={asyncValidators.validateBusinessNumber}
        description="국세청 사업자번호 검증 API를 통해 확인됩니다."
      />

      <ControlledAsyncValidator
        name="domain"
        control={control}
        label="도메인"
        placeholder="example.com"
        asyncValidator={asyncValidators.checkDomainAvailability}
        description="도메인 사용 가능 여부를 실시간으로 확인합니다."
        debounceMs={1000}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">테스트 시나리오</h4>
        <ul className="text-sm space-y-1 text-blue-700">
          <li>• 이메일: test@example.com (중복), admin@test.com (중복)</li>
          <li>• 사용자명: admin, test, user, demo (중복)</li>
          <li>• 사업자번호: 123-45-67890 (무효), 올바른 형식 사용</li>
          <li>• 도메인: google.com, facebook.com (사용중)</li>
        </ul>
      </div>

      <Button type="submit" className="w-full">계정 생성</Button>
    </form>
  );
}

// 미리 정의된 검증 함수들
const asyncValidators = {
  checkEmailDuplicate: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const existingEmails = ['test@example.com', 'admin@test.com'];
    
    if (existingEmails.includes(email.toLowerCase())) {
      return { isValid: false, message: '이미 사용 중인 이메일입니다.' };
    }
    return { isValid: true, message: '사용 가능한 이메일입니다.' };
  },

  checkUsernameDuplicate: async (username) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const existingUsernames = ['admin', 'test', 'user', 'demo'];
    
    if (username.length < 3) {
      return { isValid: false, message: '사용자명은 3자 이상이어야 합니다.' };
    }
    if (existingUsernames.includes(username.toLowerCase())) {
      return { isValid: false, message: '이미 사용 중인 사용자명입니다.' };
    }
    return { isValid: true, message: '사용 가능한 사용자명입니다.' };
  },
};`;
