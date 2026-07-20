import type { Service } from "~/types";
import ServiceCard from "./ServiceCard";

interface Props {
  services: Service[];
}

export default function ServicesGrid({ services }: Props) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      data-gsap="services-grid"
    >
      {services.map((svc) => (
        <ServiceCard key={svc.id} service={svc} />
      ))}
    </div>
  );
}
