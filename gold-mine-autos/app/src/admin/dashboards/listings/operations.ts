import { HttpError } from "wasp/server";
import type {
  CreateListing,
  UpdateListing,
  DeleteListing,
  GetAllListingsAdmin,
} from "wasp/server/operations";
import type { Listing } from "wasp/entities";
import * as z from "zod";

// Schema for creating a listing
const createListingSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number(),
  kilometers: z.number(),
  vin: z.string().optional(),
  trim: z.string().optional(),
  auctionLink: z.string(),
  auctionDate: z.string(), // ISO date string
  currentHighBid: z.number().optional(),
  currentHighBidder: z.string().optional(),
  damageEstimate: z.number(),
  estimatedMarketValue: z.number(),
  recommendedMaxBid: z.number(),
  absoluteMaxBid: z.number(),
  profitMargin: z.number(),
  estimatedTotalInvestment: z.number(),
  mainPoints: z.array(z.string()),
  carGurusLink: z.string().optional(),
  towingCost: z.number().default(0),
  detailingCost: z.number().default(0),
  extraCosts: z.number().default(0),
  repairs: z.any().optional(), // JSON
  status: z.string().default("active"),
});

type CreateListingInput = z.infer<typeof createListingSchema>;

export const createListing: CreateListing<CreateListingInput, Listing> = async (
  args,
  context
) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Only admins can create listings");
  }

  const validatedData = createListingSchema.parse(args);

  const listing = await context.entities.Listing.create({
    data: {
      ...validatedData,
      auctionDate: new Date(validatedData.auctionDate),
      addedBy: { connect: { id: context.user.id } },
    },
  });

  return listing;
};

// Update listing
const updateListingSchema = z.object({
  id: z.string(),
  // All fields optional for partial updates
  make: z.string().optional(),
  model: z.string().optional(),
  // ... (same fields as create, all optional)
  status: z.string().optional(),
});

type UpdateListingInput = z.infer<typeof updateListingSchema>;

export const updateListing: UpdateListing<UpdateListingInput, Listing> = async (
  args,
  context
) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Only admins can update listings");
  }

  const { id, ...updates } = updateListingSchema.parse(args);

  const listing = await context.entities.Listing.update({
    where: { id },
    data: updates,
  });

  return listing;
};

// Delete listing
const deleteListingSchema = z.object({
  id: z.string(),
});

type DeleteListingInput = z.infer<typeof deleteListingSchema>;

export const deleteListing: DeleteListing<DeleteListingInput, Listing> = async (
  args,
  context
) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Only admins can delete listings");
  }

  const { id } = deleteListingSchema.parse(args);

  const listing = await context.entities.Listing.delete({
    where: { id },
  });

  return listing;
};

// Get all listings (admin view - includes all statuses)
export const getAllListingsAdmin: GetAllListingsAdmin<void, Listing[]> = async (
  _args,
  context
) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Only admins can view all listings");
  }

  const listings = await context.entities.Listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      addedBy: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  return listings;
};
