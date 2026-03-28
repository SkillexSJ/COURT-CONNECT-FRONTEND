"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CourtAmenity } from "@/types/court.types";

// ROBUST FILTERING SIDEBAR COMPONENT WITH MOBILE DRAWER SUPPORT
type FilteringSidebarProps = {
  hasActiveFilters: boolean;
  searchQuery: string;
  selectedTypes: string[];
  selectedAmenityIds: string[];
  maxPrice: number;
  maxPriceCap: number;
  sortBy: string;
  typeOptions: string[];
  amenities: CourtAmenity[];
  amenitiesLoading: boolean;
  amenitiesError: boolean;
  onSearchChange: (value: string) => void;
  onToggleType: (type: string) => void;
  onToggleAmenity: (amenityId: string) => void;
  onMaxPriceChange: (value: number) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
};

const formatPrice = (value: number): string => `$${value.toLocaleString()}`;

function FilterContent({
  hasActiveFilters,
  searchQuery,
  selectedTypes,
  selectedAmenityIds,
  maxPrice,
  maxPriceCap,
  sortBy,
  typeOptions,
  amenities,
  amenitiesLoading,
  amenitiesError,
  onSearchChange,
  onToggleType,
  onToggleAmenity,
  onMaxPriceChange,
  onSortChange,
  onClear,
}: FilteringSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sidebar-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h2>

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClear}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            Clear
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="venue-search"
          className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/70"
        >
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/70" />
          <Input
            id="venue-search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by venue or location"
            className="h-10 rounded-sm border-sidebar-border bg-sidebar-accent/70 pl-8 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/70">
          Sport Type
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {typeOptions.map((sport) => {
            const active = selectedTypes.includes(sport);

            return (
              <button
                key={sport}
                type="button"
                onClick={() => onToggleType(sport)}
                className={cn(
                  "flex h-9 items-center justify-between rounded-sm border px-3 text-xs font-medium transition-colors",
                  active
                    ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                    : "border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground hover:border-sidebar-primary/60",
                )}
              >
                <span>{sport}</span>
                <span className="text-[10px]">{active ? "ON" : "OFF"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/70">
          <span>Max Hourly Rate</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={20}
          max={maxPriceCap}
          step={5}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-sidebar-accent accent-sidebar-primary"
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/70">
          Amenities
        </p>
        {amenitiesLoading ? (
          <p className="text-xs text-sidebar-foreground/70">
            Loading amenities...
          </p>
        ) : amenitiesError ? (
          <p className="text-xs text-destructive">Failed to load amenities.</p>
        ) : (
          <div className="space-y-2">
            {amenities.map((amenity) => {
              const active = selectedAmenityIds.includes(amenity.id);
              return (
                <label
                  key={amenity.id}
                  className="flex cursor-pointer items-center gap-2 text-xs text-sidebar-foreground"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggleAmenity(amenity.id)}
                    className="size-4 rounded border-sidebar-border accent-sidebar-primary"
                  />
                  <span>{amenity.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="sortBy"
          className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/70"
        >
          Sort
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 w-full rounded-sm border border-sidebar-border bg-sidebar-accent/70 px-3 text-sm text-sidebar-foreground outline-none focus:border-sidebar-ring focus:ring-2 focus:ring-sidebar-ring/30"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-rating">Highest Rated/Popular</option>
          <option value="basePrice">Price: Low to High</option>
          <option value="-basePrice">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}

export function FilteringSidebar(props: FilteringSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="flex items-center gap-2 lg:hidden">
        <Button
          type="button"
          size="sm"
          className="rounded-sm"
          onClick={() => setIsOpen(true)}
          variant="outline"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {props.hasActiveFilters && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              ✓
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-sidebar text-sidebar-foreground shadow-lg transition-transform duration-300">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-sidebar-border bg-sidebar p-4">
              <h2 className="text-lg font-semibold uppercase tracking-tight text-sidebar-foreground">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1 hover:bg-sidebar-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <FilterContent {...props} />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-sidebar-border bg-sidebar p-4">
              <Button
                type="button"
                className="w-full rounded-sm bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden h-fit space-y-6 border border-sidebar-border bg-sidebar p-5 text-sidebar-foreground lg:sticky lg:top-24 lg:block">
        <FilterContent {...props} />
      </aside>
    </>
  );
}
