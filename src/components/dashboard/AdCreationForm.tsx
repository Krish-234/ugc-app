"use client";
import { useState } from "react";
import axios from "axios";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  brandName: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  videoDuration: z.enum(["15", "30", "60"]),
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productDescription: z.string().min(10, {
    message: "Description should be at least 10 characters.",
  }),
  targetAudience: z.string().min(2, {
    message: "Please describe your target audience.",
  }),
  websiteLink: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  referenceLink: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  productImage: z.string().min(1, {
    message: "Please upload a product image.",
  }),
  avatar: z.string().min(1, {
    message: "Please select an avatar for your UGC creator",
  }),
});

const tones = [
  "Engaging Tone",
  "Gen Z Tone",
  "Motivational Tone",
  "Commercial Advertising",
  "Super Casual Tone",
  "Professional Tone",
  "Aspiring Tone",
  "Just Summary Tone",
];

export function AdCreationForm({
  serviceType,
}: {
  serviceType: string | null;
}) {
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [generatedScripts, setGeneratedScripts] = useState<string[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      videoDuration: "30",
      productName: "",
      productDescription: "",
      targetAudience: "",
      websiteLink: "",
      referenceLink: "",
      productImage: "",
      avatar: "",
    },
  });

  const handleToneSelection = (tone: string) => {
    if (selectedTones.length < 3 && !selectedTones.includes(tone)) {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  const removeTone = (toneToRemove: string) => {
    setSelectedTones(selectedTones.filter((tone) => tone !== toneToRemove));
  };

  const handleGenerateScripts = async () => {
    if (selectedTones.length !== 3) {
      setError("Please select exactly 3 tones");
      return;
    }

    const values = form.getValues();
    if (!values.productName || !values.productDescription) {
      setError("Product name and description are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/generate-script", {
        product_name: values.productName,
        product_description: values.productDescription,
        time_in_seconds: values.videoDuration,
        selected_tones: selectedTones,
      });

      const rawData = response.data.choices?.[0]?.message?.content;
      if (!rawData) {
        throw new Error("Received empty response from AI.");
      }

      const scripts: string[] = JSON.parse(rawData).map(
        (item: { script: string }) => item.script
      );

      if (scripts && scripts.length > 0) {
        setGeneratedScripts(scripts);
      } else {
        setError("No scripts were generated");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!selectedScript) {
        setError("Please select or generate a script first");
        return;
      }

      // Submit ad creation request
      toast({
        title: "Ad creation started!",
        description: "Your ad is being generated with your specifications.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {serviceType === "product-showcase"
              ? "Product Showcase"
              : serviceType === "testimonial-ad"
              ? "Testimonial Ad"
              : serviceType === "comparison-ad"
              ? "Comparison Ad"
              : "UGC Video Ad"}
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to create your ad
          </p>
        </div>
        <PointsBalance points={100} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of your product"
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
            name="productImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <FileUpload
                    endpoint="imageUpload"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
                <FormItem>
                <FormLabel>UGC Creator Avatar</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {field.value ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={field.value} />
                              <AvatarFallback>UGC</AvatarFallback>
                            </Avatar>
                            <span>Change Avatar</span>
                          </div>
                        ) : (
                          "Select Avatar"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          "https://randomuser.me/api/portraits/women/44.jpg",
                          "https://randomuser.me/api/portraits/men/32.jpg",
                          "https://randomuser.me/api/portraits/women/68.jpg",
                          "https://randomuser.me/api/portraits/men/75.jpg",
                          "https://randomuser.me/api/portraits/women/21.jpg",
                          "https://randomuser.me/api/portraits/men/22.jpg",
                          "https://randomuser.me/api/portraits/women/63.jpg",
                          "https://randomuser.me/api/portraits/men/43.jpg",
                        ].map((avatar) => (
                          <button
                            type="button"
                            key={avatar}
                            className={`rounded-full overflow-hidden border-2 ${
                              field.value === avatar
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                            onClick={() => field.onChange(avatar)}
                          >
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={avatar} />
                              <AvatarFallback>UGC</AvatarFallback>
                            </Avatar>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Women aged 25-35 interested in fitness"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="videoDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Duration</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {["15", "30", "60"].map((duration) => (
                        <button
                          type="button"
                          key={duration}
                          className={`px-4 py-2 rounded-md ${
                            field.value === duration
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => field.onChange(duration)}
                        >
                          {duration}s
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Select 3 Tones</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {tones.map((tone) => (
                <Badge
                  key={tone}
                  variant={selectedTones.includes(tone) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleToneSelection(tone)}
                >
                  {tone}
                </Badge>
              ))}
            </div>
            {selectedTones.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected tones:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTones.map((tone) => (
                    <Badge key={tone} className="pr-1">
                      {tone}
                      <button
                        onClick={() => removeTone(tone)}
                        className="ml-1 rounded-full hover:bg-accent"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {selectedTones.length !== 3 && selectedTones.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Select {3 - selectedTones.length} more tone(s)
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name="referenceLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/reference"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Ad Script</FormLabel>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateScripts}
                disabled={loading || selectedTones.length !== 3}
              >
                {loading ? "Generating..." : "Generate Scripts"}
              </Button>
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            {generatedScripts.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select one of the generated scripts:
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {generatedScripts.map((script, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        selectedScript === script
                          ? "border-primary bg-primary/10"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedScript(script)}
                    >
                      <p className="whitespace-pre-line">{script}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Textarea
              placeholder="Your ad script will appear here..."
              value={selectedScript}
              onChange={(e) => setSelectedScript(e.target.value)}
              rows={6}
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
            <Button type="submit">Create Ad (30 points)</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
