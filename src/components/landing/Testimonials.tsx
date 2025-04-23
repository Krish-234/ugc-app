import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director, EcomBrand",
    content: "AdCraft has transformed how we create UGC ads. We've seen a 3x improvement in conversion rates while cutting production time in half.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Founder, DropshipPro",
    content: "As a solo entrepreneur, I couldn't afford professional ad production. AdCraft lets me create ads that look like they cost thousands for a fraction of the price.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Agency Owner",
    content: "My clients are blown away by the quality of ads we produce with AdCraft. It's become our secret weapon for scaling ad performance.",
    rating: 4
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Marketers Worldwide</h2>
          <p className="text-muted-foreground">
            Join thousands of agencies and brands creating high-performing UGC ads.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg border bg-background">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="text-center px-4">
            <p className="text-3xl font-bold">10,000+</p>
            <p className="text-muted-foreground">Ads Created</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold">2,500+</p>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold">4.9/5</p>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}