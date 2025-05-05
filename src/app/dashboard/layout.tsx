import { Sidebar } from "@/components/dashboard/Sidebar";
import { PointsBalance } from "@/components/dashboard/PointsBalance";
import { UserDropdown } from "@/components/dashboard/UserDropdown";
import { getSession, requireAuth } from "@/app/dashboard/actions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the authenticated user
  const user = await requireAuth("/login");
  
  // If user is not authenticated, requireAuth will redirect
  // This code will only execute if user is authenticated
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
              <h1 className="text-lg font-semibold">Ad Creation Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <PointsBalance points={user.credits} />
              <UserDropdown user={{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits
              }} />
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