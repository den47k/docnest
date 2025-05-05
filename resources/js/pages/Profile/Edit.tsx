import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './partials/DeleteUserForm';
import UpdatePasswordForm from './partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './partials/UpdateProfileInformationForm';
import { Card } from '@/components/ui/card';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {

  return (
    <AuthenticatedLayout>
      <Head title="Profile" />

      <div className="py-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="p-6">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
            />
          </Card>

          <Card className="p-6">
            <UpdatePasswordForm />
          </Card>

          <Card className="p-6">
            <DeleteUserForm />
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
