// inventory/types.ts

export type Listing = {
  id: string;
  createdAt: Date;

  // Vehicle info
  make: string;
  model: string;
  year: number;
  kilometers: number;
  vin: string | null;
  trim: string | null;

  // Auction details
  auctionLink: string;
  auctionDate: Date;
  currentHighBid: number | null;
  currentHighBidder: string | null;

  // Damage
  damageEstimate: number;

  // Financial report
  estimatedMarketValue: number;
  recommendedMaxBid: number;
  absoluteMaxBid: number;
  profitMargin: number;
  estimatedTotalInvestment: number;

  // Details
  mainPoints: string[];
  carGurusLink: string | null;

  // Costs
  towingCost: number;
  detailingCost: number;
  extraCosts: number;
  repairs: any; // JSON type

  status: string;
  imageUrls: string[];
  primaryImage: string | null;
};

export type RepairItem = {
  description: string;
  partsLink: string | null;
  partsCost: number;
  labour: number;
};
