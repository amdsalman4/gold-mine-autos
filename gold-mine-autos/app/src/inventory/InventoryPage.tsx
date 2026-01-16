// inventory/InventoryPage.tsx

import { useState } from "react";
import { useQuery } from "wasp/client/operations";
import { getAllListings } from "wasp/client/operations";
import { Listings } from "./components/Listings";
import { FilterBar, type FilterOptions } from "./components/FilterBar";
import type { Listing } from "./types";

export default function InventoryPage() {
  const { data: listings, isLoading } = useQuery(getAllListings);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    minProfit: 0,
    maxBid: 0,
    sortBy: "profit",
    make: "",
  });

  // Client-side filtering (we'll move this to backend later for performance)
  const filteredListings =
    listings?.filter((listing: Listing) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          listing.make.toLowerCase().includes(searchLower) ||
          listing.model.toLowerCase().includes(searchLower) ||
          listing.vin?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Min profit filter
      if (filters.minProfit > 0 && listing.profitMargin < filters.minProfit) {
        return false;
      }

      // Max bid budget filter
      if (filters.maxBid > 0 && listing.recommendedMaxBid > filters.maxBid) {
        return false;
      }

      // Make filter
      if (
        filters.make &&
        !listing.make.toLowerCase().includes(filters.make.toLowerCase())
      ) {
        return false;
      }

      return true;
    }) || [];

  // Client-side sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (filters.sortBy) {
      case "profit":
        return b.profitMargin - a.profitMargin;
      case "auction_date":
        return (
          new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime()
        );
      case "market_value":
        return b.estimatedMarketValue - a.estimatedMarketValue;
      default:
        return 0;
    }
  });

  return (
    <div className="py-6 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        {/* <div className="mx-auto max-w-4xl text-center mb-8">
          <h1 className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Browse <span className="text-primary">High-ROI</span> Inventory
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg leading-8">
            Every vehicle is pre-vetted for profitability. Filter by your budget
            and profit targets.
          </p>
        </div> */}

        {/* Stats Bar (Optional) */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {filteredListings.length}
            </p>
            <p className="text-sm text-neutral-600">Available Vehicles</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {filteredListings.length > 0
                ? `$${Math.round(
                    filteredListings.reduce(
                      (sum, l) => sum + l.profitMargin,
                      0
                    ) / filteredListings.length
                  ).toLocaleString()}`
                : "$0"}
            </p>
            <p className="text-sm text-neutral-600">Avg. Profit</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {filteredListings.length > 0
                ? `$${Math.round(
                    filteredListings.reduce(
                      (sum, l) => sum + l.recommendedMaxBid,
                      0
                    ) / filteredListings.length
                  ).toLocaleString()}`
                : "$0"}
            </p>
            <p className="text-sm text-neutral-600">Avg. Max Bid</p>
          </div>
        </div> */}

        {/* Filter Bar */}
        <FilterBar onFilterChange={setFilters} />

        {/* Listings */}
        <Listings listings={sortedListings} isLoading={isLoading} />
      </div>
    </div>
  );
}
