// inventory/types.ts

export type Listing = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Vehicle info
  make: string;
  model: string;
  year: number;
  kilometers: number;
  vin: string | null;
  trim: string | null;
  transmission: string | null; // NEW
  engine: string | null; // NEW
  fuelType: string | null; // NEW
  drivetrain: string | null; // NEW

  // Auction details
  auctionLink: string;
  auctionDate: Date;
  currentHighBid: number | null;
  currentHighBidder: string | null;
  auctionLocation: string | null; // NEW
  auctionSite: string | null; // NEW
  lotNumber: string | null; // NEW
  laneNumber: string | null; // NEW

  // Vehicle condition
  vehicleStatus: string | null; // NEW
  damageArea: string | null; // NEW
  titleBrand: string | null; // NEW

  // Images
  imageUrls: string[];
  primaryImage: string | null;

  // Damage
  damageEstimate: number;

  // Financial report
  estimatedMarketValue: number;
  recommendedMaxBid: number;
  absoluteMaxBid: number;
  profitMargin: number;
  estimatedTotalInvestment: number;

  // Admin analysis
  analysisNotes: string | null; // NEW

  // Details
  mainPoints: string[];
  carGurusLink: string | null;

  // Costs
  auctionOverhead: number; // NEW
  towingCost: number;
  detailingCost: number;
  extraCosts: number;
  repairs: any;

  status: string;
};

export type RepairItem = {
  description: string;
  partsLink: string | null;
  partsCost: number;
  labour: number;
};
