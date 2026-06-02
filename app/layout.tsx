'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { ThemeProvider } from '../components/ThemeProvider'; // 👈 අපි හදපු Provider එක Import කරා

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
    // 💡 Hydration warning එක වළක්වන්න suppressHydrationWarning එකතු කරා
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 🚀 මුළු ඇප් එකම ThemeProvider එකෙන් ඔතා ගත්තා */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {showSidebar ? (
            // Main Dashboard Layout structure with Sidebar on left and Content on right
            // 💡 dark:bg-gray-950 දාලා ඩාර්ක් මෝඩ් එකේ පසුබිම වෙනස් කරා
            <div className="flex bg-gray-100 dark:bg-gray-950 min-h-screen transition-colors duration-200">
              <Sidebar/>
              <div className="flex-1 min-h-screen overflow-y-auto">
                {children}
              </div>
            </div>
          ) : (
            // Auth Layout (Login/Register pages) without Sidebar
            // 💡 ඩාර්ක් මෝඩ් එකට ගැළපෙන්න dark:bg-gray-950 එකතු කරා
            <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
              {children}
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}