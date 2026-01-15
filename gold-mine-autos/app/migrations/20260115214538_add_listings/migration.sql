-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "kilometers" INTEGER NOT NULL,
    "vin" TEXT,
    "trim" TEXT,
    "auctionLink" TEXT NOT NULL,
    "auctionDate" TIMESTAMP(3) NOT NULL,
    "currentHighBid" DOUBLE PRECISION,
    "currentHighBidder" TEXT,
    "damageEstimate" DOUBLE PRECISION NOT NULL,
    "estimatedMarketValue" DOUBLE PRECISION NOT NULL,
    "recommendedMaxBid" DOUBLE PRECISION NOT NULL,
    "absoluteMaxBid" DOUBLE PRECISION NOT NULL,
    "profitMargin" DOUBLE PRECISION NOT NULL,
    "mainPoints" TEXT[],
    "carGurusLink" TEXT,
    "towingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detailingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repairs" JSONB,
    "addedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingFeedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "suggestedValue" DOUBLE PRECISION,
    "notes" TEXT,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ListingFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingFeedback" ADD CONSTRAINT "ListingFeedback_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingFeedback" ADD CONSTRAINT "ListingFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
