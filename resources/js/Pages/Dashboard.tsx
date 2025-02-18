import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

declare const window: any;

export default function Dashboard() {

  return (
    <AuthenticatedLayout>
      {/* <button
        onClick={() => {
          router.post('/teams/1/members', {
            email: 'org@blog.com',
            role: 'editor',
          });
        }}
      >
        Invite user with id 2
      </button><br /><br /><br />

      <button onClick={() => {
        router.post(route('documents.store'));
      }}>
        Create new document
      </button><br /><br /><br />


      <button onClick={() => {
        router.get(route('documents.show', '01jky2h3e4x0dp9rrn7bfy2vxx'));
      }}>
        Open test Document
      </button> */}
      <div>huy</div>
    </AuthenticatedLayout>
  );
}
