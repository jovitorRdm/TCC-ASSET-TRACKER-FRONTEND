import { LoginPageContent } from '@/components/LoginPageContent';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const token = cookies().get('helloWord');

  if (token) redirect('/panel');

  return <LoginPageContent />;
}
