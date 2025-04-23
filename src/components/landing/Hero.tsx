import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Create <span className="text-primary">High-Converting</span> UGC Ads in Minutes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            The easiest way to produce authentic user-generated content ads for your clients at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#demo">See Demo</Link>
            </Button>
          </div>
          
          <div className="mt-16 rounded-xl border bg-background p-2 shadow-2xl">
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              {/* Placeholder for video or screenshot of the editor */}
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Ad Creation Interface Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}