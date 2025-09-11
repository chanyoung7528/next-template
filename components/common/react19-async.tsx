'use client';

import { Suspense, use, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
}

interface AsyncDataComponentProps {
  userId: number;
  className?: string;
}

// Promise를 생성하는 함수
const fetchUser = async (userId: number): Promise<User> => {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 가끔 에러 시뮬레이션
  if (Math.random() < 0.2) {
    throw new Error(`사용자 ${userId}를 찾을 수 없습니다.`);
  }

  // 모의 사용자 데이터
  return {
    id: userId,
    name: `사용자 ${userId}`,
    email: `user${userId}@example.com`,
    username: `user${userId}`,
    phone: `010-${Math.random().toString().slice(2, 6)}-${Math.random().toString().slice(2, 6)}`,
    website: `www.user${userId}.com`,
  };
};

// React 19의 use() 훅을 사용하는 컴포넌트
function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  // React 19의 새로운 use() 훅 사용
  const user = use(userPromise);

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-muted-foreground text-sm">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">이메일:</span>
          <span className="text-sm">{user.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">전화:</span>
          <span className="text-sm">{user.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">웹사이트:</span>
          <span className="text-sm text-blue-600">{user.website}</span>
        </div>
      </div>
    </div>
  );
}

// 로딩 컴포넌트
function UserCardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

// 에러 경계 컴포넌트
function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ComponentType<{ error: Error; retry: () => void }>;
}) {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  if (error) {
    const FallbackComponent = fallback;
    return (
      <FallbackComponent
        error={error}
        retry={() => {
          setError(null);
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  return <div key={retryCount}>{children}</div>;
}

function ErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="space-y-3">
        <div className="text-red-800">
          <h3 className="font-semibold">오류가 발생했습니다</h3>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
        <Button onClick={retry} variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
          다시 시도
        </Button>
      </div>
    </div>
  );
}

export default function React19AsyncComponent({ userId, className }: AsyncDataComponentProps) {
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [userPromise, setUserPromise] = useState(() => fetchUser(userId));

  const handleRefresh = () => {
    setUserPromise(fetchUser(currentUserId));
  };

  const handleUserChange = (newUserId: number) => {
    setCurrentUserId(newUserId);
    setUserPromise(fetchUser(newUserId));
  };

  return (
    <div className={cn('w-full max-w-md space-y-4 rounded-lg border p-6', className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">React 19 Async Data</h2>
        <p className="text-muted-foreground text-sm">use() 훅을 활용한 비동기 데이터 처리</p>
      </div>

      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((id) => (
          <Button
            key={id}
            onClick={() => handleUserChange(id)}
            variant={currentUserId === id ? 'default' : 'outline'}
            size="sm"
          >
            사용자 {id}
          </Button>
        ))}
      </div>

      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<UserCardSkeleton />}>
          <UserCard userPromise={userPromise} />
        </Suspense>
      </ErrorBoundary>

      <Button onClick={handleRefresh} variant="outline" className="w-full">
        새로고침
      </Button>

      {/* React 19 특징 설명 */}
      <div className="text-muted-foreground space-y-1 text-xs">
        <p>
          <strong>React 19 새로운 기능:</strong>
        </p>
        <ul className="ml-2 list-inside list-disc space-y-1">
          <li>
            <code>use()</code>: Promise와 Context 처리용 범용 훅
          </li>
          <li>
            <code>Suspense</code>: 향상된 비동기 처리
          </li>
          <li>자동 에러 경계 처리</li>
          <li>더 나은 로딩 상태 관리</li>
        </ul>
      </div>
    </div>
  );
}
