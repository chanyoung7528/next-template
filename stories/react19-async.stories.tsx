import { Meta, StoryObj } from '@storybook/nextjs-vite';

import React19AsyncComponent from '@/components/common/react19-async';

const meta = {
  title: 'React 19/Async Data',
  component: React19AsyncComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
React 19의 새로운 \`use()\` 훅을 활용한 비동기 데이터 처리 컴포넌트입니다.

## React 19의 use() 훅:

### 주요 특징
- **Promise 처리**: 비동기 데이터를 직관적으로 처리
- **Context 처리**: React Context도 사용 가능
- **Suspense 통합**: 자연스러운 로딩 상태 관리
- **에러 경계**: 에러 처리가 더욱 간단해짐

### 기존 방식과의 차이점
- \`useEffect\` + \`useState\` 조합을 대체
- 더 선언적이고 직관적인 코드
- 자동 로딩 및 에러 상태 관리
- Suspense와의 완벽한 통합

### 사용 예시
\`\`\`tsx
const user = use(userPromise); // Promise 처리
const theme = use(ThemeContext); // Context 처리
\`\`\`

이 컴포넌트는 모의 API 호출을 통해 사용자 데이터를 가져오며, 
때때로 의도적으로 에러를 발생시켜 에러 처리 방식을 보여줍니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userId: {
      control: { type: 'number', min: 1, max: 10 },
      description: '가져올 사용자의 ID',
      defaultValue: 1,
    },
    className: {
      control: 'text',
      description: '컴포넌트에 적용할 CSS 클래스',
    },
  },
} satisfies Meta<typeof React19AsyncComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userId: 1,
  },
  parameters: {
    docs: {
      description: {
        story: `
기본 비동기 데이터 컴포넌트입니다. 

**테스트 방법:**
1. 다른 사용자 버튼을 클릭하여 새 데이터 로딩
2. 새로고침 버튼으로 동일한 데이터 재로딩
3. 로딩 중 Skeleton UI 확인
4. 에러 발생 시 에러 처리 UI 확인 (약 20% 확률)
        `,
      },
      source: {
        code: `// React 19 use() 훅 사용 예시
'use client';

import { use, Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  email: string;
}

// Promise를 생성하는 함수
const fetchUser = async (userId: number): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // 가끔 에러 시뮬레이션
  if (Math.random() < 0.2) {
    throw new Error(\`사용자 \${userId}를 찾을 수 없습니다.\`);
  }
  
  return {
    id: userId,
    name: \`사용자 \${userId}\`,
    email: \`user\${userId}@example.com\`,
  };
};

// ✨ React 19의 use() 훅을 사용하는 컴포넌트
function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  // React 19의 새로운 use() 훅 사용
  const user = use(userPromise);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  );
}

// 로딩 컴포넌트
function UserCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
    </div>
  );
}

export default function React19AsyncComponent({ userId }: { userId: number }) {
  const [userPromise, setUserPromise] = useState(() => fetchUser(userId));

  const handleRefresh = () => {
    setUserPromise(fetchUser(userId));
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleRefresh}>새로고침</Button>
      
      {/* ✨ Suspense와 use() 훅의 완벽한 통합 */}
      <Suspense fallback={<UserCardSkeleton />}>
        <UserCard userPromise={userPromise} />
      </Suspense>
    </div>
  );
}

/* 
주요 특징:
- use() 훅: Promise를 직접 처리하여 더 선언적인 코드 작성
- Suspense 통합: 자동 로딩 상태 관리
- 에러 경계: Promise rejection 시 에러 자동 처리
- 기존 useEffect + useState 패턴을 대체하는 더 간단한 방식
*/`,
      },
    },
  },
};

export const User2: Story = {
  args: {
    userId: 2,
    className: 'border-blue-200',
  },
  parameters: {
    docs: {
      description: {
        story: '사용자 2의 데이터를 로드하는 예시입니다.',
      },
    },
  },
};

export const User3: Story = {
  args: {
    userId: 3,
    className: 'border-green-200',
  },
  parameters: {
    docs: {
      description: {
        story: '사용자 3의 데이터를 로드하는 예시입니다.',
      },
    },
  },
};

export const CustomStyled: Story = {
  args: {
    userId: 4,
    className: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 스타일이 적용된 컴포넌트입니다.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    userId: 1,
    className: 'border-indigo-200',
  },
  parameters: {
    docs: {
      description: {
        story: `
인터랙티브 데모 컴포넌트입니다. 

**React 19 use() 훅의 장점을 경험해보세요:**

1. **로딩 상태**: Suspense와 자동으로 통합되어 로딩 UI가 자연스럽게 표시됩니다.

2. **에러 처리**: Promise가 reject될 때 에러 경계가 자동으로 캐치합니다.

3. **데이터 전환**: 다른 사용자를 클릭할 때마다 새로운 Promise를 생성하여 
   \`use()\` 훅이 어떻게 처리하는지 확인할 수 있습니다.

4. **재시도 기능**: 에러 발생 시 "다시 시도" 버튼으로 복구 가능합니다.

**기존 방식과 비교:**
- \`useEffect\` + \`useState\`: 복잡한 상태 관리 필요
- \`use()\` 훅: 선언적이고 간단한 데이터 처리

약 20% 확률로 에러가 발생하므로, 여러 번 시도해보세요!
        `,
      },
      source: {
        code: `// use() 훅 vs 기존 방식 비교
'use client';

import { use, Suspense, useState, useEffect } from 'react';

// 🔄 기존 방식: useEffect + useState
function OldWayComponent({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() < 0.2) throw new Error('사용자를 찾을 수 없습니다');
        
        const userData = {
          id: userId,
          name: \`사용자 \${userId}\`,
          email: \`user\${userId}@example.com\`
        };
        
        if (!cancelled) {
          setUser(userData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchUser();
    
    return () => { cancelled = true; }; // cleanup
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!user) return <div>데이터 없음</div>;

  return (
    <div className="p-4 border rounded">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// ✨ 새로운 방식: use() 훅
function NewWayComponent({ userPromise }) {
  // Promise를 직접 use()로 처리
  const user = use(userPromise);

  return (
    <div className="p-4 border rounded">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Promise 생성 함수
const fetchUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (Math.random() < 0.2) throw new Error(\`사용자 \${userId}를 찾을 수 없습니다\`);
  
  return {
    id: userId,
    name: \`사용자 \${userId}\`,
    email: \`user\${userId}@example.com\`
  };
};

export default function ComparisonDemo() {
  const [userId, setUserId] = useState(1);
  const [userPromise, setUserPromise] = useState(() => fetchUser(1));

  const handleUserChange = (id) => {
    setUserId(id);
    setUserPromise(fetchUser(id)); // 새 Promise 생성
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 컨트롤 */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3].map(id => (
            <button
              key={id}
              onClick={() => handleUserChange(id)}
              className={\`px-3 py-2 rounded \${
                userId === id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }\`}
            >
              사용자 {id}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>🎯 테스트해보기:</strong></p>
          <ul className="ml-4 space-y-1">
            <li>• 다른 사용자 버튼 클릭</li>
            <li>• 로딩 상태 비교</li>
            <li>• 에러 발생 시 처리 방식 확인</li>
            <li>• 코드 복잡도 비교</li>
          </ul>
        </div>
      </div>

      {/* 기존 방식 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">🔴 기존 방식 (복잡)</h3>
        <div className="bg-red-50 p-4 rounded">
          <OldWayComponent userId={userId} />
        </div>
        <div className="text-xs text-gray-600">
          <p><strong>문제점:</strong></p>
          <ul className="ml-4 mt-1 space-y-1">
            <li>• 복잡한 상태 관리 (user, loading, error)</li>
            <li>• Cleanup 함수 필요</li>
            <li>• Race condition 고려</li>
            <li>• 보일러플레이트 코드 많음</li>
          </ul>
        </div>
      </div>

      {/* 새로운 방식 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-600">🟢 새로운 방식 (간단)</h3>
        <div className="bg-green-50 p-4 rounded">
          <Suspense fallback={<div>로딩 중...</div>}>
            <NewWayComponent userPromise={userPromise} />
          </Suspense>
        </div>
        <div className="text-xs text-gray-600">
          <p><strong>장점:</strong></p>
          <ul className="ml-4 mt-1 space-y-1">
            <li>• 단순한 코드 (Promise만 use()로 처리)</li>
            <li>• Suspense 자동 통합</li>
            <li>• 에러 경계 자동 처리</li>
            <li>• Race condition 걱정 없음</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* 
핵심 차이점:

📊 코드 복잡도:
- 기존: ~40줄 (상태관리 + cleanup + 에러처리)
- 신규: ~5줄 (use() + Suspense)

🚀 성능:
- 기존: 여러 리렌더링 (loading → data/error)
- 신규: 한 번만 렌더링 (Suspense가 처리)

🛡️ 안전성:
- 기존: Race condition, cleanup 관리 필요
- 신규: React가 자동 관리

💡 결론: use() 훅은 기존 useEffect + useState 패턴을 대체하는 
더 선언적이고 안전한 비동기 데이터 처리 방식입니다!
*/`,
      },
    },
  },
};
