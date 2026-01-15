// inventory/components/Listings.tsx

import { Listing } from "./Listing";
import type { Listing as ListingType } from "../types";

type ListingsProps = {
  listings: ListingType[];
  isLoading: boolean;
};

export function Listings({ listings, isLoading }: ListingsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading listings...</div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-lg mb-2">
          No listings available
        </p>
        <p className="text-sm text-neutral-500">
          Check back soon for new profitable inventory!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {listings.map((listing) => (
        <Listing key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
