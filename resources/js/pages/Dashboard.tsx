import { useContext, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useWorkspace, WorkspaceContext } from '@/lib/contexts/WorkspaceContext';
import { Link } from '@inertiajs/react';
import { Clock, Plus } from 'lucide-react';


export default function Dashboard() {
  const {
    documents
  } = useWorkspace();

  return (
    <AuthenticatedLayout>
      <main className="container mx-auto max-w-[1200px] space-y-8 px-4 py-6">
        <div className="flex items-center gap-4">
          <Link href={route('test')}>
            <Button
              className="gap-2 rounded-full border px-6 shadow-sm"
              variant={'ghost'}
            >
              <Plus className="h-5 w-5" />
              New
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Recent documents</span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {documents.map((doc) => (
              <div key={doc.id} className="group cursor-pointer">
                <Link href={route('documents.show', {document: doc.id })}>
                  <div className="aspect-[8.5/11] overflow-hidden rounded-lg border bg-white hover:border-blue-600">
                    <div className="flex h-full w-full items-center justify-center p-4 text-sm text-[#5f6368]">
                      {doc.title}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="truncate text-sm font-medium group-hover:text-blue-600">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {doc.updated_at}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
