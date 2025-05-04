import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <GuestLayout>
      <Head title="Email Verification" />

      <div className="space-y-6">
        <div className="text-center text-muted-foreground">
          Thanks for signing up! Please check your email for a verification link.
          If you didn't receive the email, we'll gladly send another.
        </div>

        {status === 'verification-link-sent' && (
          <Alert variant="default">
            <AlertDescription>
              A new verification link has been sent to your email address.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Button className="w-full" disabled={processing}>
            Resend Verification Email
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Need to sign out?{' '}
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="text-primary hover:underline underline-offset-4"
            >
              Log Out
            </Link>
          </div>
        </form>
      </div>
    </GuestLayout>
  );
}
