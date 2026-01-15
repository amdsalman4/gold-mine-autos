// inventory/operations.ts

import { HttpError } from "wasp/server";
import type { GetAllListings } from "wasp/server/operations";
import type { Listing } from "wasp/entities";

//#region Queries

export const getAllListings: GetAllListings<void, Listing[]> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "User must be authenticated to view listings");
  }

  // Get all active listings, sorted by profit (highest first)
  const listings = await context.entities.Listing.findMany({
    where: {
      status: "active",
    },
    orderBy: {
      profitMargin: "desc",
    },
  });

  return listings;
};

//#endregion

// TODO: Add filtering/search operations later
// export const getFilteredListings: GetFilteredListings<FilterInput, Listing[]> = async (args, context) => { ... }
