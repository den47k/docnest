import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="space-y-6">
        <div className="text-center text-muted-foreground">
          Forgot your password? Enter your email address and we'll send you a password reset link.
        </div>

        {status && (
          <Alert variant="default">
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              autoFocus
              required
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <Button className="w-full" disabled={processing}>
            Send Reset Link
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href={route('login')} className="text-primary hover:underline underline-offset-4">
            Login here
          </Link>
        </div>
      </div>
    </GuestLayout>
  );
}
