'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should NOT render the global sidebar layout
  const noSidebarPages = ['/login', '/register'];
  const showSidebar = !noSidebarPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        {showSidebar ? (
          // Main Dashboard Layout structure with Sidebar on left and Content on right
          <div className="flex bg-gray-100 min-h-screen">
            <Sidebar/>
            <div className="flex-1 min-h-screen overflow-y-auto">
              {children}
            </div>
          </div>
        ) : (
          // Auth Layout (Login/Register pages) without Sidebar
          <div className="min-h-screen bg-gray-100">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}