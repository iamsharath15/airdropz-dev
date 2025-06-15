// hooks/useRoleRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export function useRoleRedirect(expectedRole: 'admin' | 'user') {
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;
  const router = useRouter();
console.log("hi",user);

  useEffect(() => {
    if (role && role !== expectedRole) {
      router.replace('/');
    }
  }, [role, expectedRole, router]);
}
