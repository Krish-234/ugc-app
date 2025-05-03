"use client";

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
import { PointsBalance } from "@/components/dashboard/PointsBalance";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  rawFootage: z.string().min(1, {
    message: "Please upload your raw footage.",
  }),
  editingStyle: z.enum(["dynamic", "cinematic", "minimalist", "trendy"]),
  instructions: z.string().min(10, {
    message: "Please provide detailed instructions (at least 10 characters).",
  }),
  referenceLinks: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  desiredLength: z.enum(["15", "30", "60", "custom"]),
  customLength: z.string().optional(),
});

export function VideoEditingForm() {
  const router = useRouter();
  const pointsCost = 40;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      rawFootage: "",
      editingStyle: "dynamic",
      instructions: "",
      referenceLinks: "",
      desiredLength: "30",
      customLength: "",
    },
  });

  const desiredLength = form.watch("desiredLength");

  // In your VideoEditingForm.tsx
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/editing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: values
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit editing request')
      }
  
      toast({
        title: 'Editing request submitted!',
        description: 'Your video is being processed and will be ready in 7 days.',
      })
  
      router.push('/dashboard/history')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Professional Video Editing
          </h1>
          <p className="text-muted-foreground">
            Upload your raw footage and let our editors work their magic
          </p>
        </div>
        <PointsBalance points={100} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="My awesome product video" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rawFootage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raw Footage</FormLabel>
                <FormControl>
                  <FileUpload
                    endpoint="/api/upload?category=video"
                    value={field.value}
                    onChange={field.onChange}
                    accept="video/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="editingStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Editing Style</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["dynamic", "cinematic", "minimalist", "trendy"].map(
                      (style) => (
                        <button
                          type="button"
                          key={style}
                          className={`p-2 border rounded-md text-sm ${
                            field.value === style
                              ? "border-primary bg-primary/10"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => field.onChange(style)}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Editing Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe exactly how you want your video edited..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Links (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/video-you-like"
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
              name="desiredLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Length</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        {["15", "30", "60", "custom"].map((length) => (
                          <button
                            type="button"
                            key={length}
                            className={`p-2 border rounded-md text-sm ${
                              field.value === length
                                ? "border-primary bg-primary/10"
                                : "hover:bg-accent"
                            }`}
                            onClick={() => field.onChange(length)}
                          >
                            {length === "custom" ? "Custom" : `${length}s`}
                          </button>
                        ))}
                      </div>
                      {field.value === "custom" && (
                        <Input
                          placeholder="Enter custom length in seconds"
                          type="number"
                          min="5"
                          max="300"
                          {...form.register("customLength", {
                            required: "Please specify custom length",
                          })}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button type="submit">
              Submit for Editing ({pointsCost} points)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
