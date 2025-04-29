import { Sidebar } from "@/components/dashboard/Sidebar";
import { PointsBalance } from "@/components/dashboard/PointsBalance";
// import { auth } from "@/lib/auth";
import { UserDropdown } from "@/components/dashboard/UserDropdown";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const session = await auth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile sidebar toggle would go here */}
              <h1 className="text-lg font-semibold">Ad Creation Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <PointsBalance points={100} /> {/* Default 100 points */}
              {/* <UserDropdown user={session?.user} /> */}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}