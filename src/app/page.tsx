import { LoginPageContent } from '@/components/LoginPageContent/LoginPageContent';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const token = cookies().get('helloWorld');

  if (token) redirect('/assignment');

  return <LoginPageContent />;
}
