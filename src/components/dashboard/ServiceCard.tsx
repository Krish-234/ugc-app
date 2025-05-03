import Link from "next/link";

export function ServiceCard({ service }: { service: any }) {
  return (
    <Link
      href={`/dashboard/create?type=${service.id}`}
      className="border rounded-lg bg-white p-6 hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="flex-grow">
        <div className="text-2xl mb-3">{service.icon}</div>
        <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
      </div>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-sm font-medium text-primary">
          {service.points} points
        </span>
        <span className="text-sm text-muted-foreground">→</span>
      </div>
    </Link>
  );
}