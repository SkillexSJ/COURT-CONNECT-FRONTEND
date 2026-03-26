"use client";

import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  LoaderCircle,
  Map,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SPORT_TYPES } from "@/lib/constants/sports";
import {
  useAmenitiesQuery,
  useCourtsQuery,
} from "@/hooks/queries/use-courts-query";

// COMPONENTS FOR VENUE CATALOG PAGE
import { FilteringSidebar } from "./components/filtering-sidebar";
import { VenueGrid, type VenueGridView } from "./components/venue-grid";

const PAGE_LIMIT = 9;
const MAX_PRICE_CAP = 250;

// HELPER FUNCTIONS
const parseCsvParam = (value: string | null): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parsePositiveInt = (value: string | null, fallback: number): number => {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

// TYPES
type FilterState = {
  activeCategory: string;
  selectedTypes: string[];
  selectedAmenityIds: string[];
  searchQuery: string;
  sortBy: string;
  maxPrice: number;
  currentPage: number;
  view: VenueGridView;
};

type FilterAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: string }
  | { type: "TOGGLE_TYPE"; payload: string }
  | { type: "TOGGLE_AMENITY"; payload: string }
  | { type: "SET_MAX_PRICE"; payload: number }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_VIEW"; payload: VenueGridView }
  | {
      type: "RESET_FILTERS";
      payload: {
        activeCategory: string;
        sortBy: string;
        view: VenueGridView;
      };
    };

// REUSABLE REDUCER FUNCTION TO MANAGE FILTER STATE
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.payload, currentPage: 1 };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_SORT":
      return { ...state, sortBy: action.payload, currentPage: 1 };
    case "TOGGLE_TYPE": {
      const nextTypes = state.selectedTypes.includes(action.payload)
        ? state.selectedTypes.filter((item) => item !== action.payload)
        : [...state.selectedTypes, action.payload];

      return {
        ...state,
        selectedTypes: nextTypes,
        activeCategory: nextTypes[0] ?? state.activeCategory,
        currentPage: 1,
      };
    }
    case "TOGGLE_AMENITY": {
      const nextAmenityIds = state.selectedAmenityIds.includes(action.payload)
        ? state.selectedAmenityIds.filter((item) => item !== action.payload)
        : [...state.selectedAmenityIds, action.payload];
      return { ...state, selectedAmenityIds: nextAmenityIds, currentPage: 1 };
    }
    case "SET_MAX_PRICE":
      return { ...state, maxPrice: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "RESET_FILTERS":
      return {
        ...state,
        selectedTypes: [],
        selectedAmenityIds: [],
        searchQuery: "",
        maxPrice: MAX_PRICE_CAP,
        currentPage: 1,
        activeCategory: action.payload.activeCategory,
        sortBy: action.payload.sortBy,
        view: action.payload.view,
      };
    default:
      return state;
  }
}

type VenueCatalogProps = {
  initialCategory?: string;
};

export function VenueCatalog({
  initialCategory = "All Venues",
}: VenueCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // SYNCING FILTER STATE WITH URL QUERY PARAMETERS FOR BETTER UX
  const initialState: FilterState = {
    activeCategory: initialCategory,
    selectedTypes: parseCsvParam(searchParams.get("type")),
    selectedAmenityIds: parseCsvParam(searchParams.get("amenityIds")),
    searchQuery: searchParams.get("searchTerm") ?? "",
    sortBy: searchParams.get("sortBy") ?? "-createdAt",
    maxPrice: parsePositiveInt(
      searchParams.get("basePrice_lte"),
      MAX_PRICE_CAP,
    ),
    currentPage: parsePositiveInt(searchParams.get("page"), 1),
    view: (searchParams.get("view") as VenueGridView) ?? "grid",
  };

  const [filters, dispatch] = useReducer(filterReducer, initialState);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchQuery);

  // DEBOUNCE SEARCH INPUT TO AVOID EXCESSIVE API CALLS WHILE TYPING
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery]);

  // FUNCTION TO UPDATE URL QUERY PARAMETERS BASED ON CURRENT FILTER STATE
  const syncQueryParams = useCallback(
    (mutator: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutator(params);

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (nextQuery === currentQuery) return;

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  // RESET TO FIRST PAGE WHEN ANY FILTER CHANGES TO ENSURE USER SEES RESULTS FOR NEW FILTERS
  useEffect(() => {
    const currentSearchTerm = searchParams.get("searchTerm") ?? "";
    if (currentSearchTerm === debouncedSearch) return;

    syncQueryParams((params) => {
      if (debouncedSearch) {
        params.set("searchTerm", debouncedSearch);
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");
    });
  }, [debouncedSearch, searchParams, syncQueryParams]);

  // STORING CURRENT FILTERS IN URL QUERY PARAMETERS
  const queryParams = useMemo(
    () => ({
      searchTerm: debouncedSearch || undefined,
      page: filters.currentPage,
      limit: PAGE_LIMIT,
      sortBy: filters.sortBy,
      type:
        filters.selectedTypes.length > 0 ? filters.selectedTypes : undefined,
      amenityIds:
        filters.selectedAmenityIds.length > 0
          ? filters.selectedAmenityIds
          : undefined,
      basePrice_lte:
        filters.maxPrice < MAX_PRICE_CAP ? filters.maxPrice : undefined,
    }),
    [
      debouncedSearch,
      filters.currentPage,
      filters.maxPrice,
      filters.selectedAmenityIds,
      filters.selectedTypes,
      filters.sortBy,
    ],
  );

  const courtsQuery = useCourtsQuery(queryParams);
  const amenitiesQuery = useAmenitiesQuery();

  // FINAL FILTER COURTS
  const courts = useMemo(
    () => courtsQuery.data?.data ?? [],
    [courtsQuery.data],
  );
  // BUILDING RESPONSE
  const meta = courtsQuery.data?.meta;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const currentPage = meta?.currentPage ?? filters.currentPage;
  const totalItems = meta?.totalItems ?? courts.length;

  // DYNAMIC TYPES
  const dynamicTypeOptions = useMemo(() => {
    const fromData = courts
      .map((court) => court.type)
      .filter(Boolean)
      .filter((value, index, list) => list.indexOf(value) === index);

    return [...new Set([...SPORT_TYPES, ...fromData])];
  }, [courts]);

  // CHECK IF ANY FILTER IS ACTIVE TO SHOW CLEAR BUTTON IN UI
  const hasActiveFilters =
    filters.selectedTypes.length > 0 ||
    filters.selectedAmenityIds.length > 0 ||
    filters.maxPrice < MAX_PRICE_CAP ||
    Boolean(searchParams.get("searchTerm"));

  const setPage = (nextPage: number) => {
    dispatch({ type: "SET_PAGE", payload: nextPage });
    syncQueryParams((params) => {
      params.set("page", String(nextPage));
    });
  };

  return (
    <section className="mx-auto mb-10 w-full max-w-350 mt-10 lg:mt-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Venues
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {totalItems} premium arenas near your location
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-sm border border-border bg-card p-1">
          <Button
            type="button"
            size="sm"
            className={cn(
              "h-8 rounded-sm px-3",
              filters.view !== "grid" && "bg-transparent",
            )}
            variant={filters.view === "grid" ? "default" : "ghost"}
            onClick={() => {
              dispatch({ type: "SET_VIEW", payload: "grid" });
              syncQueryParams((params) => {
                params.set("view", "grid");
              });
            }}
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            type="button"
            size="sm"
            className={cn(
              "h-8 rounded-sm px-3",
              filters.view !== "map" && "bg-transparent",
            )}
            variant={filters.view === "map" ? "default" : "ghost"}
            onClick={() => {
              dispatch({ type: "SET_VIEW", payload: "map" });
              syncQueryParams((params) => {
                params.set("view", "map");
              });
            }}
          >
            <Map className="h-4 w-4" />
            Map
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilteringSidebar
          hasActiveFilters={hasActiveFilters}
          searchQuery={filters.searchQuery}
          selectedTypes={filters.selectedTypes}
          selectedAmenityIds={filters.selectedAmenityIds}
          maxPrice={filters.maxPrice}
          maxPriceCap={MAX_PRICE_CAP}
          sortBy={filters.sortBy}
          typeOptions={dynamicTypeOptions}
          amenities={amenitiesQuery.data?.data ?? []}
          amenitiesLoading={amenitiesQuery.isLoading}
          amenitiesError={amenitiesQuery.isError}
          onSearchChange={(value) =>
            dispatch({ type: "SET_SEARCH", payload: value })
          }
          onToggleType={(type) => {
            dispatch({ type: "TOGGLE_TYPE", payload: type });
            const nextTypes = filters.selectedTypes.includes(type)
              ? filters.selectedTypes.filter((item) => item !== type)
              : [...filters.selectedTypes, type];

            syncQueryParams((params) => {
              if (nextTypes.length > 0) {
                params.set("type", nextTypes.join(","));
              } else {
                params.delete("type");
              }
              params.set("page", "1");
            });
          }}
          onToggleAmenity={(amenityId) => {
            dispatch({ type: "TOGGLE_AMENITY", payload: amenityId });
            const nextAmenityIds = filters.selectedAmenityIds.includes(
              amenityId,
            )
              ? filters.selectedAmenityIds.filter((item) => item !== amenityId)
              : [...filters.selectedAmenityIds, amenityId];

            syncQueryParams((params) => {
              if (nextAmenityIds.length > 0) {
                params.set("amenityIds", nextAmenityIds.join(","));
              } else {
                params.delete("amenityIds");
              }
              params.set("page", "1");
            });
          }}
          onMaxPriceChange={(value) => {
            dispatch({ type: "SET_MAX_PRICE", payload: value });
            syncQueryParams((params) => {
              if (value >= MAX_PRICE_CAP) {
                params.delete("basePrice_lte");
              } else {
                params.set("basePrice_lte", String(value));
              }
              params.set("page", "1");
            });
          }}
          onSortChange={(value) => {
            dispatch({ type: "SET_SORT", payload: value });
            syncQueryParams((params) => {
              params.set("sortBy", value);
              params.set("page", "1");
            });
          }}
          onClear={() => {
            dispatch({
              type: "RESET_FILTERS",
              payload: {
                activeCategory: initialCategory,
                sortBy: "-createdAt",
                view: filters.view,
              },
            });

            syncQueryParams((params) => {
              params.delete("searchTerm");
              params.delete("type");
              params.delete("amenityIds");
              params.delete("basePrice_lte");
              params.set("page", "1");
            });
          }}
        />

        <div className="space-y-6">
          <VenueGrid
            courts={courts}
            view={filters.view}
            isLoading={courtsQuery.isLoading}
            isError={courtsQuery.isError}
            pageLimit={PAGE_LIMIT}
            onRetry={() => courtsQuery.refetch()}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Page {String(currentPage).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </p>

            <div className="flex items-center gap-2">
              {courtsQuery.isFetching ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  Updating
                </span>
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                className="rounded-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="default"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                className="rounded-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VenueCatalog;
