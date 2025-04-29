"use client";

import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PointsBalance } from "@/components/dashboard/PointsBalance";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  videoDuration: z.enum(["15", "30", "60"]),
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  targetAudience: z.string().min(2, {
    message: "Please describe your target audience.",
  }),
  keyMessage: z.string().min(10, {
    message: "Key message should be at least 10 characters.",
  }),
  style: z.enum(["casual", "professional", "fun", "luxury"]),
});

export default function CreateAdPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAdPageContent />
    </Suspense>
  );
}

function CreateAdPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adType = searchParams.get("type");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      videoDuration: "30",
      productName: "",
      targetAudience: "",
      keyMessage: "",
      style: "casual",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Handle ad creation logic here
      
      toast({
        title: "Ad creation started!",
        description: "Your UGC ad is being generated with your specifications.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Create {adType?.replace("-", " ")} Ad</h1>
          <p className="text-muted-foreground">
            Fill in the details below to generate your ad
          </p>
        </div>
        <PointsBalance points={100} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product being advertised" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Women aged 25-35 interested in fitness" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keyMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What should be the main takeaway of this ad?" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="videoDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="casual">Casual/UGC</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="fun">Fun/Playful</SelectItem>
                      <SelectItem value="luxury">Luxury/Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit">
              Create Ad (30 points)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
