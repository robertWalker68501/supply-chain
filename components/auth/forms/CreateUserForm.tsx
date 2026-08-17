'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createUserSchema } from '@/lib/schemas/UserSchema';
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

const CreateUserForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      callbackURL: '',
    },
  });

  const onSubmit = (data: z.infer<typeof createUserSchema>) => {
    const { name, email, password, callbackURL } = data;

    startTransition(async () => {
      await authClient.signUp.email(
        {
          name,
          email,
          password,
          callbackURL: '/dashboard',
        },
        {
          onSuccess: () => {
            toast.add({
              type: 'success',
              title: 'Account created successfully',
              description:
                'Pleas check your email to verify your email address',
            });
            router.push(`${callbackURL}`);
            router.refresh();
          },
          onError: () => {
            toast.add({
              type: 'error',
              title: 'Failed to create account',
            });
          },
        }
      );
    });
  };

  return (
    <Card className='mx-auto w-full max-w-lg'>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Sign up to strat managing you supply chain
        </CardDescription>
      </CardHeader>
      <form
        id='create-user-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='name'
              label='Full Name'
              type='text'
              placeholder='John Doe'
            />
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
            <FormFieldControl
              control={form.control}
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              placeholder='********'
            />
            <div className='flex w-full flex-col gap-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => form.reset()}
                    disabled={isPending}
                  >
                    Reset
                  </Button>
                  <Button
                    form='create-user-form'
                    type='submit'
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader
                        size={6}
                        className='animate-spin'
                      />
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Already have an account?{' '}
                  <Link
                    href='/sign-in'
                    className='hover:text-primary'
                  >
                    Sign In
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

export default CreateUserForm;
