
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger />
            <div className="w-full flex justify-center">
              <h1 className={cn("text-2xl font-bold text-center text-manga", 
                isMobile ? "ml-4" : "")}>
                MangaTrack
              </h1>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
