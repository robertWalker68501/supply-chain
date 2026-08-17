import DashboardSidebar from '@/components/sidebar/DashboardSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className='flex min-w-0 flex-1 flex-col'>
        <div>
          <SidebarTrigger />
        </div>
        <div className='p-5'>{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
