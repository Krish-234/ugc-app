import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { PointsBalance } from "@/components/dashboard/PointsBalance";

const services = [
  {
    id: "ugc-video",
    title: "UGC Video Ad",
    description: "Create authentic user-generated style video ads",
    points: 30,
    icon: "🎥",
    formComponent: "UgcVideoForm",
  },
  {
    id: "product-showcase",
    title: "Product Showcase",
    description: "Highlight product features with professional editing",
    points: 25,
    icon: "📦",
    formComponent: "ProductShowcaseForm",
  },
  {
    id: "testimonial-ad",
    title: "Testimonial Ad",
    description: "Turn customer testimonials into compelling ads",
    points: 20,
    icon: "💬",
    formComponent: "TestimonialAdForm",
  },
  {
    id: "comparison-ad",
    title: "Comparison Ad",
    description: "Show your product vs competitors",
    points: 35,
    icon: "⚖️",
    formComponent: "ComparisonAdForm",
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Professional editing for your raw footage",
    points: 40,
    icon: "✂️",
    formComponent: "VideoEditingForm",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Ad</h1>
        <p className="text-muted-foreground">
          Select an ad type to get started. Each creation uses points from your balance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}