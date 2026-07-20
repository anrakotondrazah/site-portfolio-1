import type { GalleryItem } from "~/types";

interface Props {
  item: GalleryItem;
}

export default function GalleryCard({ item }: Props) {
  return (
    <div
      className="group relative overflow-hidden bg-cyber-dark-3 border border-cyber-border hover:border-cyber-cyan/50 hover:shadow-cyan-sm transition-all duration-500 rounded-sm break-inside-avoid mb-4"
      data-cursor-hover="true"
    >
      {/* Image Container */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: item.aspectRatio }}
      >
        {/* Placeholder background colored block instead of real image if missing */}
        <div className="absolute inset-0 bg-cyber-dark-2 flex items-center justify-center text-cyber-text-dim text-xs select-none">
          NV // {item.displayTitle}
        </div>
        <img
          src={item.src}
          alt={item.displayTitle}
          className="w-full h-full object-cover relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          onError={(e) => {
            // Hide image if failed to load to let placeholder stay visible
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        {/* Shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-60 z-20" />
      </div>

      {/* Slide-up details panel */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 bg-cyber-dark-3/95 border-t border-cyber-border/40 p-4 transition-all duration-500 ease-out z-30">
        <h4 className="font-display text-xs tracking-wider text-cyber-cyan mb-1">
          {item.displayTitle}
        </h4>
        <p className="font-mono text-[10px] text-cyber-text-secondary line-clamp-3 mb-2">
          {item.prompt}
        </p>
        <span className="inline-block font-mono text-[8px] bg-cyber-cyan/15 text-cyber-cyan px-2 py-0.5 border border-cyber-cyan/20">
          {item.hoverText}
        </span>
      </div>
    </div>
  );
}
