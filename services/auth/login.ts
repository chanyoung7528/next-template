// src/lib/services/auth/login.ts

import { z } from 'zod';

import { apiRequest } from '@/lib/apiClient';
import { loginSchema, type LoginFormValues } from '@/lib/schema/auth';

interface LoginResponse {
  token: string;
  [key: string]: unknown;
}

export async function login(input: LoginFormValues) {
  try {
    const validated = loginSchema.parse(input);

    const response = await apiRequest<LoginResponse>('/auth', {
      method: 'POST',
      body: JSON.stringify({
        userName: validated.userName,
        password: validated.password,
      }),
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('입력 형식이 올바르지 않습니다.');
    }
    if (error instanceof Error) {
      throw new Error(`로그인 실패: ${error.message}`);
    }
    throw new Error('로그인 중 알 수 없는 오류가 발생했습니다.');
  }
}
