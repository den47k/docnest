import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Document } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

export default function DocumentCard({
  document,
  canManageDocuments,
}: {
  document: Document;
  canManageDocuments: boolean;
}) {
  const queryClient = useQueryClient();

  const handleDelete = () => {
    router.delete(route('documents.destroy', { document: document.id }), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      },
    });
  };

  return (
    <div className="group relative cursor-pointer">
      <Link href={route('documents.show', { document: document.id })}>
        <div className="aspect-[8.5/11] overflow-hidden rounded-lg border bg-white hover:border-blue-600">
          <div className="flex h-full w-full items-center justify-center p-4 text-sm text-[#5f6368]">
            {document.title}
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <h3 className="truncate text-sm font-medium group-hover:text-blue-600">
            {document.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {new Date(document.updated_at).toLocaleString()}
          </p>
        </div>
      </Link>

      {canManageDocuments && (
        <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  document and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
