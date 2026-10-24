import type { Metadata } from 'next';
import { LoginContainer } from '@/features/auth/containers/LoginContainer.container';
import { DEMO_ADMIN, IS_DEMO_MODE } from '@/server/demo/demoMode';

export const metadata: Metadata = { title: 'Iniciar sesión' };

export default function LoginPage() {
  return <LoginContainer demoLogin={IS_DEMO_MODE ? { email: DEMO_ADMIN.email, password: DEMO_ADMIN.password } : null} />;
}
