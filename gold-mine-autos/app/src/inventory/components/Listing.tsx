// inventory/components/Listing.tsx

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
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

  // Parse repairs JSON
  const repairs: RepairItem[] = listing.repairs?.items || [];
  const totalRepairCost = repairs.reduce(
    (sum, r) => sum + r.partsCost + r.labour,
    0
  );

  return (
    <Card className="w-full border-b border-neutral-200 hover:bg-neutral-50 transition-all">
      <div className="flex flex-col lg:flex-row items-stretch justify-between w-full gap-4 p-4">
        {/* Column 1: Vehicle Info */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <a
            href={listing.auctionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-lg text-neutral-900 hover:text-primary line-clamp-1"
          >
            {listing.year} {listing.make} {listing.model}
          </a>

          <p className="text-neutral-700 text-sm">
            {listing.trim && <span>{listing.trim} / </span>}
            {formatKm(listing.kilometers)}
          </p>

          {listing.vin && (
            <p className="text-xs font-medium text-neutral-600">
              {listing.vin}
            </p>
          )}

          {/* Main selling points */}
          {listing.mainPoints.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {listing.mainPoints.slice(0, 3).map((point, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                >
                  {point}
                </span>
              ))}
            </div>
          )}

          {/* Damage estimate at bottom */}
          <p className="text-sm text-red-600 font-medium mt-auto">
            Damage Est: {formatCurrency(listing.damageEstimate)}
          </p>
        </div>

        {/* Column 2: Auction Details */}
        <div className="flex flex-col gap-2 border-l border-dashed border-neutral-200 pl-4 min-w-[180px]">
          <a
            href={listing.auctionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Auction <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-1 text-sm text-neutral-700">
            <MapPin className="w-4 h-4" />
            <span>Location TBD</span> {/* Add location to schema if needed */}
          </div>

          {listing.currentHighBidder ? (
            <div className="text-sm">
              <p className="text-neutral-600">Current Bid:</p>
              <p className="font-semibold">
                {formatCurrency(listing.currentHighBid || 0)}
              </p>
              <p className="text-xs text-neutral-500">
                {listing.currentHighBidder}
              </p>
            </div>
          ) : (
            <p className="text-sm text-green-600 font-medium">No bids yet</p>
          )}
        </div>

        {/* Column 3: Financial Summary */}
        <div className="flex flex-col gap-3 border-l border-dashed border-neutral-200 pl-4 min-w-[220px]">
          {/* Time until auction */}
          <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
            <Clock className="w-4 h-4" />
            {getTimeUntilAuction()}
          </div>

          {/* Financial metrics */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Est. Market Value:</span>
              <span className="font-semibold">
                {formatCurrency(listing.estimatedMarketValue)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-600">Recommended Max:</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(listing.recommendedMaxBid)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-600">Absolute Max:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(listing.absoluteMaxBid)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-1 mt-1">
              <span className="text-neutral-600">Total Investment:</span>
              <span className="font-semibold">
                {formatCurrency(listing.estimatedTotalInvestment)}
              </span>
            </div>

            <div className="flex justify-between bg-green-50 px-2 py-1 rounded">
              <span className="text-green-700 font-medium">Profit:</span>
              <span className="font-bold text-green-700">
                {formatCurrency(listing.profitMargin)}
              </span>
            </div>
          </div>

          {/* View calculations button */}
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
                View Calculations <ChevronDown className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expandable Details Section */}
      {showDetails && (
        <div className="border-t border-neutral-200 p-4 bg-neutral-50">
          <h3 className="font-semibold text-base mb-3">Detailed Breakdown</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost Breakdown */}
            <div>
              <h4 className="font-medium text-sm text-neutral-700 mb-2">
                Estimated Costs
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Towing:</span>
                  <span>{formatCurrency(listing.towingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Detailing:</span>
                  <span>{formatCurrency(listing.detailingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Repairs (Total):</span>
                  <span>{formatCurrency(totalRepairCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Costs:</span>
                  <span>{formatCurrency(listing.extraCosts)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total Costs:</span>
                  <span>
                    {formatCurrency(
                      listing.towingCost +
                        listing.detailingCost +
                        totalRepairCost +
                        listing.extraCosts
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Repair Items */}
            {repairs.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-neutral-700 mb-2">
                  Repair Details
                </h4>
                <div className="space-y-2">
                  {repairs.map((repair, idx) => (
                    <div
                      key={idx}
                      className="text-sm border-l-2 border-blue-300 pl-2"
                    >
                      <p className="font-medium">{repair.description}</p>
                      <div className="text-xs text-neutral-600">
                        Parts: {formatCurrency(repair.partsCost)} | Labour:{" "}
                        {formatCurrency(repair.labour)}
                        {repair.partsLink && (
                          <a
                            href={repair.partsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline ml-2"
                          >
                            Link <ExternalLink className="inline w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CarGurus Reference */}
          {listing.carGurusLink && (
            <div className="mt-3 pt-3 border-t">
              <a
                href={listing.carGurusLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View Market Value Reference (CarGurus){" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
