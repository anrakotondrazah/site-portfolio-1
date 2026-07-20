import type { Service } from "~/types";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div
      className="group relative bg-cyber-dark-3 border border-cyber-border hover:border-cyber-cyan/50 hover:shadow-cyan-sm p-6 transition-all duration-500 rounded-sm"
      data-cursor-hover="true"
    >
      {/* Badge (optional) */}
      {service.badge && (
        <span className="absolute top-4 right-4 font-mono text-[9px] bg-cyber-cyan/15 text-cyber-cyan px-2 py-0.5 border border-cyber-cyan/30 rounded-full">
          {service.badge}
        </span>
      )}

      {/* Service Icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-cyber-cyan/5 border border-cyber-cyan/20 text-cyber-cyan text-xl mb-6 group-hover:scale-110 group-hover:border-cyber-cyan/50 transition-all duration-300">
        {service.icon === "camera" && "📷"}
        {service.icon === "user" && "👤"}
        {service.icon === "play" && "▶️"}
        {service.icon === "diamond" && "💎"}
        {service.icon === "zap" && "⚡"}
        {service.icon === "brain" && "🧠"}
      </div>

      {/* Title & Desc */}
      <h3 className="font-display text-sm text-white tracking-wide mb-2 group-hover:text-cyber-cyan transition-colors">
        {service.title}
      </h3>
      <p className="font-mono text-xs text-cyber-text-secondary mb-6 leading-relaxed">
        {service.description}
      </p>

      {/* Includes features list */}
      <ul className="space-y-2 mb-6 border-t border-cyber-border/20 pt-4">
        {service.includes.map((feat, i) => (
          <li
            key={i}
            className="font-mono text-[10px] text-cyber-text-dim/80 flex items-center gap-2"
          >
            <span className="text-cyber-cyan/60">✦</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* Price & CTA */}
      <div className="flex justify-between items-center border-t border-cyber-border/20 pt-4">
        <div>
          <p className="font-mono text-[9px] text-cyber-text-dim uppercase tracking-wider">
            Price
          </p>
          <p className="font-mono text-sm text-cyber-cyan font-bold">
            {service.price}
          </p>
        </div>
        <span className="font-mono text-xs tracking-wider text-cyber-cyan group-hover:translate-x-2 transition-all duration-300">
          {service.cta}
        </span>
      </div>
    </div>
  );
}
