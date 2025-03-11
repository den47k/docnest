import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Clock,  } from 'lucide-react';

declare const window: any;

export default function Dashboard({ documents }: any) {
  // const { selectedTeam } = usePage().props.auth.user;
  const recentDocs = [
    { id: 1, title: "Project Proposal", lastModified: "Modified Dec 12, 2023" },
    { id: 2, title: "Meeting Notes", lastModified: "Modified Dec 10, 2023" },
    { id: 3, title: "Q4 Report", lastModified: "Modified Dec 8, 2023" },
    { id: 4, title: "Budget 2024", lastModified: "Modified Dec 5, 2023" },
    { id: 5, title: "Team Updates", lastModified: "Modified Dec 1, 2023" },
  ]

  // console.log("Documets: " + JSON.stringify(documents, null, 2));
  // console.log(selectedTeam);

  return (
    <AuthenticatedLayout>
      <main className="container mx-auto py-6 px-4 space-y-8 max-w-[1200px]">
        <div className="flex items-center gap-4">
          <Button className="gap-2 rounded-full px-6 border shadow-sm" variant={'ghost'}>
            <Plus className="h-5 w-5" />
            New
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Recent documents</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="group cursor-pointer">
                <div className="aspect-[8.5/11] rounded-lg border bg-white hover:border-blue-600 overflow-hidden">
                  <div className="h-full w-full p-4 flex items-center justify-center text-[#5f6368] text-sm">
                    {doc.title}
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="text-sm font-medium truncate group-hover:text-blue-600">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground">{doc.lastModified}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
