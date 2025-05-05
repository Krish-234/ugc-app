import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹15000",
    period: "/month",
    description: "Perfect for individuals and small teams",
    features: [
      "50 ad credits/month",
      "Basic templates",
      "AI script generation",
      "Performance analytics",
      "Email support"
    ],
    cta: "Get Started"
  },
  {
    name: "Professional",
    price: "₹20000",
    period: "/month",
    description: "For growing agencies and brands",
    features: [
      "200 ad credits/month",
      "Premium templates",
      "Advanced AI tools",
      "Client workspaces",
      "Priority support"
    ],
    cta: "Start Free Trial",
    featured: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large teams and agencies",
    features: [
      "Unlimited ad credits",
      "All premium features",
      "White labeling",
      "Dedicated account manager",
      "API access"
    ],
    cta: "Contact Sales"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">
            Choose the plan that fits your needs. Scale up or down as you grow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl border bg-background p-6 shadow-sm ${plan.featured ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                size="lg" 
                className="w-full"
                variant={plan.featured ? "default" : "outline"}
              >
                <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Need something different? We offer custom plans for high-volume users.</p>
        </div>
      </div>
    </section>
  );
}