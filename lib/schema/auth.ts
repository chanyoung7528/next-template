import { z } from 'zod';

export const loginSchema = z.object({
  userName: z.string().nonempty('아이디를 입력해 주세요.'),
  password: z.string().min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
  saveId: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
