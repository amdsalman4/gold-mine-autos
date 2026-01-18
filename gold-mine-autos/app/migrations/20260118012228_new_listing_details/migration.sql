-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "analysisNotes" TEXT,
ADD COLUMN     "auctionLocation" TEXT,
ADD COLUMN     "auctionOverhead" DOUBLE PRECISION NOT NULL DEFAULT 500,
ADD COLUMN     "auctionSite" TEXT,
ADD COLUMN     "damageArea" TEXT,
ADD COLUMN     "drivetrain" TEXT,
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "laneNumber" TEXT,
ADD COLUMN     "lotNumber" TEXT,
ADD COLUMN     "titleBrand" TEXT,
ADD COLUMN     "transmission" TEXT,
ADD COLUMN     "vehicleStatus" TEXT;
