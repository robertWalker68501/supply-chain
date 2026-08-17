'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signInUserSchema } from '@/lib/schemas/UserSchema';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/components/ui/toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { FormFieldControl } from '@/components/form-fields/FormFieldControl';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import Link from 'next/link';

const SignInUserForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInUserSchema>>({
    resolver: zodResolver(signInUserSchema),
    defaultValues: {
      email: '',
      password: '',
      callbackURL: '',
    },
  });

  const onSubmit = (data: z.infer<typeof signInUserSchema>) => {
    const { email, password, callbackURL } = data;

    startTransition(async () => {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: '/dashboard',
        },
        {
          onSuccess: () => {
            toast.add({
              type: 'success',
              title: 'Signed in successfully',
            });
            router.push(`${callbackURL}`);
            router.refresh();
          },
          onError: () => {
            toast.add({
              type: 'error',
              title: 'Failed to sign in',
            });
          },
        }
      );
    });
  };

  return (
    <Card className='mx-auto w-full max-w-lg'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in and start managing</CardDescription>
      </CardHeader>
      <form
        id='sign-in-user-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='email'
              label='Email'
              type='email'
              placeholder='john.doe@example.com'
            />
            <FormFieldControl
              control={form.control}
              name='password'
              label='Password'
              type='password'
              placeholder='********'
            />
            <div className='flex w-full flex-col gap-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Button
                    form='sign-in-user-form'
                    type='submit'
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader
                        size={6}
                        className='animate-spin'
                      />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link
                    href='/sign-up'
                    className='hover:text-primary'
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
};

export default SignInUserForm;
