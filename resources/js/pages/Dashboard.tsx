import DocumentCard from '@/components/features/documents/DocumentCard';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useWorkspace } from '@/lib/contexts/WorkspaceContext';
import { Head, usePage } from '@inertiajs/react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { File, Plus } from 'lucide-react';

export default function Dashboard({
  canManageDocuments,
}: {
  canManageDocuments: boolean;
}) {
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <DashboardContent canManageDocuments={canManageDocuments} />
    </AuthenticatedLayout>
  );
}

function DashboardContent({
  canManageDocuments,
}: {
  canManageDocuments: boolean;
}) {
  const { url } = usePage();
  const { currentTeam, isLoading: isWorkspaceLoading } = useWorkspace();

  const queryParams = new URLSearchParams(url.split('?')[1] || '');
  const searchTerm = queryParams.get('search') || '';

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isDocumentsLoading,
  } = useInfiniteQuery({
    queryKey: ['documents', currentTeam.id, searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(route('documents.index'), {
        params: {
          team_id: currentTeam.id === 'personal' ? null : currentTeam.id,
          search: searchTerm,
          page: pageParam,
        },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    enabled: !!currentTeam && 'id' in currentTeam,
  });

  const documents = data?.pages.flatMap((page) => page.data) || [];

  const createNewDocument = async () => {
    try {
      const response = await axios.post(route('documents.store'), {
        team_id: currentTeam.id === 'personal' ? null : currentTeam.id,
      });
      const newDocument = response.data.document;
      await queryClient.invalidateQueries({
        queryKey: ['documents', currentTeam.id],
      });
      window.location.href = route('documents.show', {
        document: newDocument.id,
      });
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  return (
    <main className="container mx-auto max-w-[1200px] space-y-8 px-4 py-6">
      {canManageDocuments && (
        <div className="flex items-center gap-4">
          <Button
            className="gap-2 rounded-full border px-6 shadow-sm"
            variant={'ghost'}
            onClick={createNewDocument}
          >
            <Plus className="h-5 w-5" />
            New
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <File className="h-4 w-4" />
          <span className="text-sm">Documents</span>
        </div>

        {isDocumentsLoading || isWorkspaceLoading ? (
          <div className="text-muted-foreground">Loading documents...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                canManageDocuments={canManageDocuments}
              />
            ))}
            {hasNextPage && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
