// @/pages/Login.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login({ status, canResetPassword }: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm<{
    email: string;
    password: string;
    remember: boolean;
  }>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      <div className="space-y-6">
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
              autoComplete="username"
              required
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              autoComplete="current-password"
              required
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={data.remember}
                onCheckedChange={(checked) => setData('remember', checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-medium">
                Remember me
              </Label>
            </div>

            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            Log in
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            href={route('register')}
            className="text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </div>
    </GuestLayout>
  );
}
