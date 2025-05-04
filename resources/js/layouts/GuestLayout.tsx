// @/layouts/GuestLayout.tsx
import { PropsWithChildren } from 'react';
import { Card } from '@/components/ui/card';

export default function Guest({ children }: PropsWithChildren) {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <span className="text-2xl font-bold text-primary">DocNest</span>
        </div>
        <Card className="p-6 sm:p-8 shadow-lg rounded-xl">
          {children}
        </Card>
      </div>
    </div>
  );
}
