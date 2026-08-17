import GoBackButton from '@/components/GoBackButton';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) return redirect('/dashboard');

  return (
    <>
      <div className='mt-5 ml-5'>
        <GoBackButton
          href='/'
          text='Go Back'
        />
      </div>
      <div className='flex h-dvh flex-col items-center justify-center'>
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
