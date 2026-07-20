import { useState } from "react";
import type { GalleryItem } from "~/types";
import GalleryCard from "./GalleryCard";
import { galleryCategories } from "~/data/gallery";

interface Props {
  items: GalleryItem[];
}

export default function MasonryGrid({ items }: Props) {
  const [filter, setFilter] = useState<
    "ALL" | "PRODUCTS" | "PORTRAITS" | "SPACES" | "FOOD" | "FASHION"
  >("ALL");

  const filteredItems =
    filter === "ALL" ? items : items.filter((item) => item.category === filter);

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div
        className="flex flex-wrap gap-2 justify-center mb-12"
        data-gsap="gallery-filter"
      >
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`font-mono text-xs tracking-widest px-4 py-2 border transition-all duration-300 cursor-none ${
              filter === cat
                ? "border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-cyan-sm"
                : "border-cyber-border/30 text-cyber-text-secondary hover:border-cyber-cyan/50 hover:text-cyber-cyan"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Columns */}
      <div
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
        data-gsap="gallery-masonry"
      >
        {filteredItems.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="font-mono text-xs text-cyber-text-secondary">
            No results in this category yet — check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
