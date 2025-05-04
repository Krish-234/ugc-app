"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // Add this import

// Interfaces
interface Ad {
  id: string;
  serviceType: string;
  brandName: string;
  productName: string;
  status: string;
  progress: number;
  estimatedReady: Date;
  createdAt: Date;
  completedFileUrl: string | null;
}

interface EditingRequest {
  id: string;
  projectName: string;
  status: string;
  progress: number;
  estimatedReady: Date;
  createdAt: Date;
  completedFileUrl: string | null;
}

export default function HistoryPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingRequests, setEditingRequests] = useState<EditingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adsRes, editingRes] = await Promise.all([
        fetch("/api/ads"),
        fetch("/api/editing"),
      ]);

      if (adsRes.ok) {
        const adData = await adsRes.json();
        setAds(adData);
      }

      if (editingRes.ok) {
        const editingData = await editingRes.json();
        setEditingRequests(editingData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "Error",
        description: "Failed to fetch your history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = (url: string | null) => {
    if (!url) {
      toast({
        title: "Error",
        description: "No file available for download",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;

    // Extract filename from URL
    const filename = url.split("/").pop() || "download";
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Content History</h1>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading your content...</div>
      ) : (
        <>
          {/* Editing Requests */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Editing Requests</h2>
            {editingRequests.length === 0 ? (
              <p className="text-muted-foreground">
                You haven't submitted any editing requests yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {editingRequests.map((req) => (
                  <Card key={req.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{req.projectName}</CardTitle>
                          <CardDescription>
                            Created on{" "}
                            {new Date(req.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            req.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : req.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Progress
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {req.progress}%
                            </span>
                          </div>
                          <Progress value={req.progress} />
                        </div>
                        <div className="text-sm">
                          <p>
                            Estimated ready:{" "}
                            {new Date(req.estimatedReady).toLocaleDateString()}
                          </p>
                        </div>
                        {req.status === "COMPLETED" && req.completedFileUrl && (
                          <Button
                            onClick={() => handleDownload(req.completedFileUrl)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Edited Video
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Ads */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Ad History</h2>
            {ads.length === 0 ? (
              <p className="text-muted-foreground">
                You haven't created any ads yet.
              </p>
            ) : (
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
                            {ad.serviceType.replace("-", " ")} • Created on{" "}
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
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
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Progress
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {ad.progress}%
                            </span>
                          </div>
                          <Progress value={ad.progress} />
                        </div>
                        <div className="text-sm">
                          <p>
                            Estimated ready:{" "}
                            {new Date(ad.estimatedReady).toLocaleDateString()}
                          </p>
                        </div>
                        {ad.status === "COMPLETED" && ad.completedFileUrl && (
                          <Button
                            onClick={() => handleDownload(ad.completedFileUrl)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Ad
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
