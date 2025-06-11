'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginFormValues, loginSchema } from '@/lib/schema/auth';

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: '',
      password: '',
      saveId: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormValues) => {
    console.log('Form Submitted:', data);
    // localStorage.setItem("savedId", data.saveId ? data.userName : "");
  };

  return (
    <div className="flex min-h-[100%] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-white)] p-10 shadow-md">
        <h1 className="mb-3 text-3xl font-bold text-[var(--color-gray-900)]">Back Office 로그인</h1>
        <p className="mb-8 text-sm text-[var(--color-gray-600)]">관리자 계정으로 로그인하세요.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 아이디 */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-[var(--color-gray-700)]">아이디</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="아이디를 입력해 주세요."
                      className="rounded-md border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-4 py-3 shadow-sm transition focus:ring-2 focus:ring-[var(--color-gray-500)] focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-red-500" />
                </FormItem>
              )}
            />

            {/* 비밀번호 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-[var(--color-gray-700)]">비밀번호</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력해 주세요."
                        className="rounded-md border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-4 py-3 pr-10 shadow-sm transition focus:ring-2 focus:ring-[var(--color-gray-500)] focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="비밀번호 보기 토글"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage className="mt-1 text-red-500" />
                </FormItem>
              )}
            />

            {/* 아이디 저장 */}
            <FormField
              control={form.control}
              name="saveId"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="saveId"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <FormLabel htmlFor="saveId" className="text-sm font-normal text-[var(--color-gray-700)]">
                    아이디 저장
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-lg bg-[var(--color-button-bg)] font-semibold text-black transition-all hover:bg-[var(--color-button-hover-bg)]"
            >
              로그인
            </Button>
          </form>
        </Form>

        {/* 비밀번호 재설정 링크 */}
        <p className="mt-6 text-center text-sm text-[var(--color-gray-600)]">
          비밀번호를 잊으셨나요?{' '}
          <a href="#" className="text-[var(--color-gray-700)] underline transition hover:text-[var(--color-gray-900)]">
            재설정하기
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
