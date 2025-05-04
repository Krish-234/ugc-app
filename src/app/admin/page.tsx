// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  RefreshCw,
  Download,
  Loader2,
  User,
  FileText,
  BarChart2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FileSelectionDialog } from "@/components/admin/FileSelectionDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface UserData {
  id: string;
  name: string;
  email: string;
  totalRequests: number;
  completedRequests: number;
  lastRequest: string;
}

interface Ad {
  id: string;
  serviceType: string;
  brandName: string;
  productName: string;
  status: string;
  progress: number;
  estimatedReady: string;
  createdAt: string;
  completedFileUrl: string | null;
  userId: string;
  userEmail: string;
  description: string;
}

interface EditingRequest {
  id: string;
  projectName: string;
  status: string;
  progress: number;
  estimatedReady: string;
  createdAt: string;
  completedFileUrl: string | null;
  userId: string;
  userEmail: string;
  description: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("requests");
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingRequests, setEditingRequests] = useState<EditingRequest[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adsRes, editingRes, usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/ads"),
        fetch("/api/admin/editing"),
        fetch("/api/admin/users"),
        fetch("/api/admin/stats"),
      ]);

      if (!adsRes.ok || !editingRes.ok || !usersRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [adsData, editingData, usersData, statsData] = await Promise.all([
        adsRes.json(),
        editingRes.json(),
        usersRes.json(),
        statsRes.json(),
      ]);

      setAds(adsData);
      setEditingRequests(editingData);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="requests">
            <FileText className="mr-2 h-4 w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Ad Requests ({ads.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {ads.map((ad) => (
                <Card key={ad.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {ad.brandName} - {ad.productName}
                        </CardTitle>
                        <CardDescription>
                          {ad.serviceType.replace("-", " ")} • Created by{" "}
                          {ad.userEmail} •{" "}
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ad.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : ad.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ad.status}
                        </span>
                        {ad.completedFileUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(ad.completedFileUrl!, "_blank")
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {ad.description}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {ad.progress}%
                          </span>
                        </div>
                        <Progress value={ad.progress} />
                      </div>
                      <p className="text-sm">
                        Estimated ready:{" "}
                        {new Date(ad.estimatedReady).toLocaleDateString()}
                      </p>
                      {ad.status !== "COMPLETED" && (
                        <FileSelectionDialog
                          requestId={ad.id} // Changed from request.id to ad.id
                          type="ad" // Changed from "editing" to "ad" for ad requests
                          onComplete={fetchData}
                        >
                          <Button size="sm" className="w-full">
                            <Check className="mr-2 h-4 w-4" />
                            {ad.progress === 100
                              ? "Select Final File"
                              : "Complete Request"}
                          </Button>
                        </FileSelectionDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Editing Requests ({editingRequests.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {editingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{request.projectName}</CardTitle>
                        <CardDescription>
                          Created by {request.userEmail} •{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : request.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {request.status}
                        </span>
                        {request.completedFileUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(request.completedFileUrl!, "_blank")
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {request.progress}%
                          </span>
                        </div>
                        <Progress value={request.progress} />
                      </div>
                      <p className="text-sm">
                        Estimated ready:{" "}
                        {new Date(request.estimatedReady).toLocaleDateString()}
                      </p>
                      {request.status !== "COMPLETED" && (
                        <FileSelectionDialog
                          requestId={request.id}
                          type="editing"
                          onComplete={handleComplete}
                          userId={request.userId}
                        >
                          <Button size="sm" className="w-full">
                            <Check className="mr-2 h-4 w-4" />
                            {request.progress === 100
                              ? "Select Final File"
                              : "Complete Request"}
                          </Button>
                        </FileSelectionDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Total Requests
                      </span>
                      <span>{user.totalRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <span>{user.completedRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Last Request</span>
                      <span>
                        {new Date(user.lastRequest).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Requests
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRequests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.completedRequests}
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(
                    (stats.completedRequests / stats.totalRequests) * 100
                  )}
                  % completion rate
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.pendingRequests}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
