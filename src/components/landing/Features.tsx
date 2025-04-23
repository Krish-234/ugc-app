import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const features = [
  {
    title: "AI-Powered Script Generation",
    description: "Generate high-converting ad scripts tailored to your product in seconds."
  },
  {
    title: "Drag & Drop Editor",
    description: "Easily customize templates with your brand assets and messaging."
  },
  {
    title: "Real Creator Network",
    description: "Access our network of vetted UGC creators or upload your own content."
  },
  {
    title: "Performance Analytics",
    description: "Track which ads perform best and optimize your campaigns."
  },
  {
    title: "Client Management",
    description: "Organize and manage multiple clients with separate workspaces."
  },
  {
    title: "White Label Options",
    description: "Brand the platform as your own for a professional client experience."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale UGC Ads</h2>
          <p className="text-muted-foreground">
            Our platform provides all the tools to create, manage, and optimize user-generated content ads.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border bg-background hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button asChild variant="outline">
            <Link href="/signup">Explore All Features</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}