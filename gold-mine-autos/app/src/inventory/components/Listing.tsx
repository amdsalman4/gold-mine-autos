// inventory/components/Listing.tsx

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Clock } from "lucide-react";
import { Card } from "../../client/components/ui/card";
import { Button } from "../../client/components/ui/button";
import { cn } from "../../client/utils";
import type { Listing as ListingType, RepairItem } from "../types";

export function Listing({ listing }: { listing: ListingType }) {
  const [showDetails, setShowDetails] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format kilometers
  const formatKm = (km: number) => {
    return new Intl.NumberFormat("en-CA").format(km) + " km";
  };

  // Calculate time until auction
  const getTimeUntilAuction = () => {
    const now = new Date();
    const auction = new Date(listing.auctionDate);
    const diffMs = auction.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return "Ending soon";
    }
  };

  // Format auction date/time
  const formatAuctionDate = () => {
    const date = new Date(listing.auctionDate);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) + " EST"
    );
  };

  // Parse repairs JSON
  const repairs: RepairItem[] = listing.repairs?.items || [];
  const totalRepairCost = repairs.reduce(
    (sum, r) => sum + r.partsCost + r.labour,
    0
  );
  const totalEstimatedCosts =
    listing.towingCost +
    listing.detailingCost +
    listing.damageEstimate +
    listing.extraCosts +
    totalRepairCost;

  return (
    <div className="w-full border-b border-neutral-200 hover:bg-neutral-50/50 transition-all">
      {/* Top Row: Tags */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {/* Left: Estimated Costs Tag */}
        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200">
            Est. Costs: {formatCurrency(totalEstimatedCosts)}
          </span>
        </div>

        {/* Right: Time + Market Value Tags */}
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-orange-200 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {getTimeUntilAuction()}
          </span>

          <a
            href={listing.carGurusLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-m font-semibold border border-green-200 hover:bg-green-200 transition-colors flex items-center gap-1"
            onClick={(e) => {
              if (!listing.carGurusLink) {
                e.preventDefault();
              }
            }}
          >
            Market Value: {formatCurrency(listing.estimatedMarketValue)}
            {listing.carGurusLink && <ExternalLink className="w-4 h-4" />}
          </a>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-4">
        {/* Column 1: Image (col-span-2) */}
        <div className="col-span-2 flex flex-col items-center">
          {listing.primaryImage ? (
            <img
              src={listing.primaryImage}
              alt={`${listing.year} ${listing.make} ${listing.model}`}
              className="w-[200px] h-[160px] rounded object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/150x110?text=No+Image";
              }}
            />
          ) : (
            <div className="w-[150px] h-[110px] bg-neutral-200 rounded flex items-center justify-center text-neutral-400 text-xs">
              No Image
            </div>
          )}
          {listing.imageUrls && listing.imageUrls.length > 1 && (
            <a
              href={listing.auctionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-2"
            >
              View All Images
            </a>
          )}
        </div>

        {/* Column 2: Vehicle Title & Basic Info (col-span-5) */}
        <div className="col-span-5 flex flex-col gap-2">
          <a
            href={listing.auctionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-lg text-neutral-900 hover:text-primary uppercase"
          >
            {listing.year} {listing.make} {listing.model}
          </a>

          {/* VIN, Stock, Damage */}
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-neutral-600">VIN #: </span>
              <span className="font-medium">{listing.vin || "N/A"}</span>
            </div>
            {listing.trim && (
              <div>
                <span className="text-neutral-600">Trim: </span>
                <span className="font-medium">{listing.trim}</span>
              </div>
            )}
            <div>
              <span className="text-neutral-600">Damage Estimate: </span>
              <span className="font-medium">
                {formatCurrency(listing.damageEstimate)}
              </span>
            </div>
          </div>

          {/* Main selling points */}
          {listing.mainPoints.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {listing.mainPoints.slice(0, 4).map((point, idx) => (
                <span
                  key={idx}
                  className="text-xs  px-2 py-0.5 rounded border "
                >
                  {point}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Specs (col-span-2) */}
        <div className="col-span-2 flex flex-col gap-2 text-sm">
          <div>
            <span className="font-medium">{formatKm(listing.kilometers)}</span>
          </div>
          <div>
            <span className="text-neutral-600">Transmission: </span>
            <span>Auto</span>
          </div>
          {listing.currentHighBidder ? (
            <div>
              <span className="text-neutral-600">Current Bid: </span>
              <span className="font-semibold">
                {formatCurrency(listing.currentHighBid || 0)}
              </span>
            </div>
          ) : (
            <span className="text-green-600 font-medium">No bids yet</span>
          )}
        </div>

        {/* Column 4: Auction Details & Profit (col-span-3) */}
        <div className="col-span-3 flex flex-col gap-2">
          {/* Auction Date/Time */}
          <div className="text-sm">
            <div className="font-semibold text-neutral-900">
              {formatAuctionDate()}
            </div>
            {/* <div className="text-neutral-600 text-xs mt-1">
              Status:{" "}
              <span className="text-green-600 font-semibold uppercase">
                Active
              </span>
            </div> */}
          </div>

          {/* Profit Badge */}
          <div className="border border-grey-200 rounded-lg p-3 mt-2">
            <div className="text-xs text-neutral-600 mb-1">
              Estimated Profit
            </div>
            {/* <div className="text-2xl font-bold text-green-700">
              {formatCurrency(listing.profitMargin)}
            </div> */}
            <div className="text-xs text-neutral-500 mt-1">
              Max Bid: {formatCurrency(listing.recommendedMaxBid)}
            </div>
          </div>

          {/* Check Calculation Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mt-auto"
          >
            {showDetails ? (
              <>
                Hide Calculations <ChevronUp className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Check Calculations <ChevronDown className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expandable Details Section */}
      {showDetails && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <h3 className="font-semibold text-base mb-4 text-neutral-900">
            Detailed Financial Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Bidding Strategy */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <h4 className="font-semibold text-sm text-neutral-700 mb-3 border-b pb-2">
                Bidding Strategy
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Market Value:</span>
                  <span className="font-semibold">
                    {formatCurrency(listing.estimatedMarketValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Recommended Max:</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(listing.recommendedMaxBid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Absolute Max:</span>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(listing.absoluteMaxBid)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-neutral-600">Total Investment:</span>
                  <span className="font-semibold">
                    {formatCurrency(listing.estimatedTotalInvestment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Cost Breakdown */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <h4 className="font-semibold text-sm text-neutral-700 mb-3 border-b pb-2">
                Cost Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Towing:</span>
                  <span>{formatCurrency(listing.towingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Detailing:</span>
                  <span>{formatCurrency(listing.detailingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Repairs:</span>
                  <span>{formatCurrency(totalRepairCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Damage Estimate:</span>
                  <span>{formatCurrency(listing.damageEstimate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Extra Costs:</span>
                  <span>{formatCurrency(listing.extraCosts)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Costs:</span>
                  <span>{formatCurrency(totalEstimatedCosts)}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Repair Details */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <h4 className="font-semibold text-sm text-neutral-700 mb-3 border-b pb-2">
                Repair Details
              </h4>
              {repairs.length > 0 ? (
                <div className="space-y-3">
                  {repairs.map((repair, idx) => (
                    <div
                      key={idx}
                      className="text-sm border-l-2 border-blue-300 pl-3"
                    >
                      <p className="font-medium text-neutral-900">
                        {repair.description}
                      </p>
                      <div className="text-xs text-neutral-600 mt-1 space-y-0.5">
                        <div>Parts: {formatCurrency(repair.partsCost)}</div>
                        <div>Labour: {formatCurrency(repair.labour)}</div>
                        {repair.partsLink && (
                          <a
                            href={repair.partsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Parts Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No repairs needed</p>
              )}
            </div>
          </div>

          {/* Reference Links */}
          {listing.carGurusLink && (
            <div className="mt-4 pt-4 border-t">
              <a
                href={listing.carGurusLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View Market Value Research (CarGurus){" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
