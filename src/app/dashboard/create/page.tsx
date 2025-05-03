"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";

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
  websiteLink: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  referenceLink: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  avatarId: z.string().min(1, {
    message: "Please select an avatar.",
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

const avatarOptions = [
  {
    id: "avatar1",
    name: "Tech Entrepreneur",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Professional yet approachable for tech products"
  },
  {
    id: "avatar2",
    name: "Fitness Influencer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Energetic and motivational for health products"
  },
  {
    id: "avatar3",
    name: "Friendly Mom",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Relatable for household and family products"
  },
  {
    id: "avatar4",
    name: "Young Professional",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    description: "Modern and stylish for lifestyle products"
  },
  {
    id: "avatar5",
    name: "Beauty Guru",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    description: "Trendy and knowledgeable for beauty products"
  },
  {
    id: "avatar6",
    name: "Outdoor Enthusiast",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    description: "Adventurous for outdoor and sports products"
  }
];

export default function CreateAdPage() {
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [generatedScripts, setGeneratedScripts] = useState<string[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const adType = searchParams.get("type");

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
      avatarId: "",
    },
  });

  const handleToneSelection = (tone: string) => {
    if (selectedTones.length < 3 && !selectedTones.includes(tone)) {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  const removeTone = (toneToRemove: string) => {
    setSelectedTones(selectedTones.filter(tone => tone !== toneToRemove));
  };

  const handleGenerateScripts = async () => {
    setLoading(true);
    
    const values = form.getValues();
    const response = await axios.post("/api/generate-script", {
      product_name: values.productName,
      product_description: values.productDescription,
      time_in_seconds: parseInt(values.videoDuration),
      selected_tones: selectedTones,
    });

    const rawData = response.data.scripts;
    const scripts: string[] = rawData.map((item: { script: string }) => item.script);
    setGeneratedScripts(scripts);
    
    setLoading(false);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Ad creation started!",
      description: "Your UGC ad is being generated with your specifications.",
    });
    router.push("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto">
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
            <FormLabel>Select UGC Creator Avatar</FormLabel>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the persona that best represents your target audience
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {avatarOptions.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    form.watch("avatarId") === avatar.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => form.setValue("avatarId", avatar.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={avatar.image}
                        alt={avatar.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{avatar.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {avatar.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <FormMessage>
              {form.formState.errors.avatarId?.message}
            </FormMessage>
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
                <p className="text-sm text-muted-foreground mb-2">Selected tones:</p>
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
          </div>

          <FormField
            control={form.control}
            name="referenceLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/reference" {...field} />
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
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit" disabled={!selectedScript || !form.watch("avatarId")}>
              Create Ad (30 points)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}