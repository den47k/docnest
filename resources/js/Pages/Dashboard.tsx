import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutProto';
import { router } from '@inertiajs/react';

declare const window: any;

export default function Dashboard() {

  return (
    <AuthenticatedLayout>
      <button
        onClick={() => {
          router.post('/teams/1/members', {
            email: 'org@blog.com',
            role: 'editor',
          });
        }}
      >
        Invite user with id 2
      </button>
      <br /><br /><br />

      <button
        onClick={() => {
          router.post('/teams/invitations/3', {});
        }}
      >
        Accept invitation
      </button>
    </AuthenticatedLayout>
  );
}
