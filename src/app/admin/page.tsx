// app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, RefreshCw, Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Ad {
  id: string
  serviceType: string
  brandName: string
  productName: string
  status: string
  progress: number
  estimatedReady: string
  createdAt: string
}

interface EditingRequest {
  id: string
  projectName: string
  status: string
  progress: number
  estimatedReady: string
  createdAt: string
  completedFileUrl: string | null
}

export default function AdminPanel() {
  const [ads, setAds] = useState<Ad[]>([])
  const [editingRequests, setEditingRequests] = useState<EditingRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [adsRes, editingRes] = await Promise.all([
        fetch('/api/admin/ads'),
        fetch('/api/admin/editing'),
      ])

      
      const adsData = await adsRes.json()
      const editingData = await editingRes.json()
      
      setAds(adsData)
      setEditingRequests(editingData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const completeAd = async (adId: string) => {
    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: 'POST',
      })
      
      if (!response.ok) throw new Error()
      
      toast({
        title: 'Success',
        description: 'Ad marked as completed',
      })
      fetchData()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete ad',
        variant: 'destructive',
      })
    }
  }

  const completeEditing = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/editing/${requestId}`, {
        method: 'POST',
      })
      
      if (!response.ok) throw new Error()
      
      toast({
        title: 'Success',
        description: 'Editing request marked as completed',
      })
      fetchData()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete editing request',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Ad Requests ({ads.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{ad.brandName} - {ad.productName}</CardTitle>
                      <CardDescription>
                        {ad.serviceType.replace('-', ' ')} • Created on{' '}
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ad.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : ad.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ad.status}
                      </span>
                      {ad.status !== 'COMPLETED' && (
                        <Button
                          size="sm"
                          onClick={() => completeAd(ad.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {ad.progress}%
                        </span>
                      </div>
                      {/* <Progress value={ad.progress} /> */}
                    </div>
                    <p className="text-sm">
                      Estimated ready: {new Date(ad.estimatedReady).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Editing Requests ({editingRequests.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {editingRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{request.projectName}</CardTitle>
                      <CardDescription>
                        Created on {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status}
                      </span>
                      {request.status !== 'COMPLETED' && (
                        <Button
                          size="sm"
                          onClick={() => completeEditing(request.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Complete
                        </Button>
                      )}
                      {request.completedFileUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(request.completedFileUrl!, '_blank')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {request.progress}%
                        </span>
                      </div>
                      {/* <Progress value={request.progress} /> */}
                    </div>
                    <p className="text-sm">
                      Estimated ready: {new Date(request.estimatedReady).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}