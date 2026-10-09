import type { Metadata } from 'next';
import { LoginContainer } from '@/features/auth/containers/LoginContainer.container';

export const metadata: Metadata = { title: 'Iniciar sesión' };

export default function LoginPage() {
  return <LoginContainer />;
}
