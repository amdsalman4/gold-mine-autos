// inventory/components/Listing.tsx

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Clock } from "lucide-react";
import { Button } from "../../client/components/ui/button";
import { cn } from "../../client/utils";
import type { Listing as ListingType, RepairItem } from "../types";

export function Listing({ listing }: { listing: ListingType }) {
  const [showDetails, setShowDetails] = useState(false);
  const [bidAmount, setBidAmount] = useState(listing.recommendedMaxBid); // Add this state

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
    return new Intl.NumberFormat("en-CA").format(km) + " Km";
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

  // Handle click on listing (except for buttons/links)
  const handleListingClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button, link, or interactive element
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a")
    ) {
      return;
    }
    window.open(listing.auctionLink, "_blank");
  };
  //Profit Caluclation
  const calculatedProfit =
    listing.estimatedMarketValue - bidAmount - totalEstimatedCosts;
  return (
    <div
      className="w-full border-b border-neutral-200 hover:bg-neutral-50/50 transition-all cursor-pointer"
      onClick={handleListingClick}
    >
      {/* Top Row: Tags */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {/* Left: Estimated Costs Tag */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold border">
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

        {/* Column 2: Vehicle Info (col-span-3) */}
        <div className="col-span-3 flex flex-col gap-1">
          {/* Title - Make Model Trim */}
          <a
            href={listing.auctionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-base text-neutral-900 hover:text-primary uppercase"
          >
            {listing.year} {listing.make} {listing.model} {listing.trim || ""}
          </a>

          {/* VIN */}
          <div className="text-sm">
            <span className="text-neutral-600">VIN #: </span>
            <span>{listing.vin || "N/A"}</span>
          </div>

          {/* Stock Number (using listing ID) */}
          <div className="text-sm">
            <span className="text-neutral-600">Stock #: </span>
            <span>{listing.id.slice(0, 8)}</span>
          </div>

          {/* Damage Area - Dummy for now */}
          <div className="text-sm">
            <span>Front End</span>
          </div>

          {/* Damage Estimate */}
          <div className="text-sm">
            <span className="text-neutral-600">Damage Estimate: </span>
            <span>{formatCurrency(listing.damageEstimate)}</span>
          </div>

          {/* Main selling points */}
          {listing.mainPoints.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {listing.mainPoints.slice(0, 3).map((point, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded border border-neutral-300 bg-neutral-50"
                >
                  {point}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Specs (col-span-2) */}
        <div className="col-span-2 flex flex-col gap-1 text-sm">
          {/* Kilometers */}
          {/* Kilometers */}
          <div>
            <span>{formatKm(listing.kilometers)}</span>
          </div>

          {/* Transmission */}
          <div>
            <span className="text-neutral-600">Transmission: </span>
            <span>Auto</span>
          </div>

          {/* Status - Dummy for now */}
          <div>
            <span className="text-green-600">Starts</span>
          </div>

          {/* Engine - Dummy for now */}
          <div>
            <span className="text-neutral-600">Engine: </span>
            <span>2.0L I4</span>
          </div>
        </div>

        {/* Column 4: Location & Title Info (col-span-2) */}
        <div className="col-span-2 flex flex-col gap-1 text-sm">
          {/* Location - Dummy for now */}
          <div>
            <a href="#" className="text-primary hover:underline">
              Toronto (Oshawa)
            </a>
          </div>

          {/* Lane/Run - Dummy */}
          <div>
            <span>Lane: 3 Run: 45</span>
          </div>

          {/* Location Name */}
          <div>
            <span className="text-neutral-600">Location: </span>
            <span>IAA Toronto</span>
          </div>

          {/* Title Brand - Dummy for now */}
          <div>
            <span>ON-NOT BRANDED</span>
          </div>
        </div>

        {/* Column 5: Auction Details & Profit (col-span-3) */}
        <div className="col-span-3 flex flex-col gap-2">
          {/* Auction Date/Time */}
          <div className="text-sm">
            <div className="font-semibold text-neutral-900">
              {formatAuctionDate()}
            </div>
          </div>

          {/* Current Bid or Status */}
          {listing.currentHighBidder ? (
            <div className="text-sm">
              <span className="text-neutral-600">Current Bid: </span>
              <span className="font-semibold">
                {formatCurrency(listing.currentHighBid || 0)}
              </span>
              <div className="text-xs text-neutral-500">
                {listing.currentHighBidder}
              </div>
            </div>
          ) : (
            <div className="text-sm">
              <span className="text-green-600 font-semibold">No bids yet</span>
            </div>
          )}

          {/* Profit Calculator Badge */}
          <div className="border border-neutral-200 rounded-lg p-3 mt-auto">
            <div className="space-y-2 text-sm">
              {/* Market Value */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Market Value:</span>

                {formatCurrency(listing.estimatedMarketValue)}
              </div>

              {/* Bid Input */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">If place bid:</span>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-600">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) =>
                      setBidAmount(parseFloat(e.target.value) || 0)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="w-24 px-2 py-1 border border-neutral-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Estimated Costs */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-600">Minus est. costs:</span>

                {formatCurrency(totalEstimatedCosts)}
              </div>

              <hr className="border-neutral-300" />

              {/* Profit Result */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Estimated Profit:</span>
                <span
                  className={cn("font-bold text-lg", {
                    "text-green-700": calculatedProfit > 0,
                    "text-red-700": calculatedProfit <= 0,
                  })}
                >
                  {formatCurrency(calculatedProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Check Calculation Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="w-full"
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
        <div className="border-t border-neutral-200 bg-white px-6 py-6">
          <h3 className="text-lg mb-6 text-neutral-900">
            Detailed Financial Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Our Analysis & Notes */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-neutral-900 mb-2">Our Analysis</h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {/* This will come from schema later - using dummy text for now */}
                  This vehicle represents a strong opportunity based on current
                  market conditions. The estimated market value is derived from
                  recent comparable sales in the GTA area. We recommend staying
                  conservative with your bid to maintain a healthy profit margin
                  after accounting for all reconditioning costs.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <h4 className="text-sm text-neutral-900 mb-3">
                  Bidding Strategy
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Market Value:</span>
                    <span className="text-neutral-900">
                      {formatCurrency(listing.estimatedMarketValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">
                      Recommended Max Bid:
                    </span>
                    <span className="text-neutral-900">
                      {formatCurrency(listing.recommendedMaxBid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Absolute Max Bid:</span>
                    <span className="text-neutral-900">
                      {formatCurrency(listing.absoluteMaxBid)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reference Links */}
              {listing.carGurusLink && (
                <div className="pt-4 border-t border-neutral-200">
                  <a
                    href={listing.carGurusLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-900 underline flex items-center gap-1 hover:text-neutral-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Market Value Research{" "}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: Editable Cost Breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm text-neutral-900 mb-3">
                Cost Breakdown (Editable)
              </h4>

              <div className="space-y-4">
                {/* Towing Cost */}
                <div className="pb-3 border-b border-neutral-200">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">Towing</p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Transport from auction to your lot
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-neutral-600">$</span>
                      <input
                        type="number"
                        defaultValue={listing.towingCost}
                        onChange={(e) => {
                          // Will add state management here
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Detailing Cost */}
                <div className="pb-3 border-b border-neutral-200">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">Detailing</p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Interior and exterior cleaning, minor touch-ups
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-neutral-600">$</span>
                      <input
                        type="number"
                        defaultValue={listing.detailingCost}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Repair Costs */}
                {repairs.length > 0 ? (
                  repairs.map((repair, idx) => (
                    <div key={idx} className="pb-3 border-b border-neutral-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          {repair.partsLink && (
                            <a
                              href={repair.partsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-neutral-600 underline mt-0.5 inline-flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Parts source <ExternalLink className="w-2 h-2" />
                            </a>
                          )}
                          )
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-600">
                            Parts cost
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-neutral-600">$</span>
                            <input
                              type="number"
                              defaultValue={repair.partsCost}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-600">
                            Labour cost
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-neutral-600">$</span>
                            <input
                              type="number"
                              defaultValue={repair.labour}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pb-3 border-b border-neutral-200">
                    <p className="text-sm text-neutral-900">Repairs</p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      No repairs needed
                    </p>
                  </div>
                )}

                {/* Damage Estimate */}
                <div className="pb-3 border-b border-neutral-200">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">
                        Additional Damage Estimate
                      </p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Unforeseen repairs or hidden damage buffer
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-neutral-600">$</span>
                      <input
                        type="number"
                        defaultValue={listing.damageEstimate}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Extra Costs */}
                <div className="pb-3 border-b border-neutral-200">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">Extra Costs</p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Safety certification, admin fees, storage
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-neutral-600">$</span>
                      <input
                        type="number"
                        defaultValue={listing.extraCosts}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Costs - Calculated */}
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900">
                      Total Estimated Costs:
                    </span>
                    <span className="text-base text-neutral-900">
                      {formatCurrency(totalEstimatedCosts)}
                    </span>
                  </div>
                </div>

                {/* Total Investment */}
                <div className="pt-2 border-t border-neutral-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900">
                      Total Investment (Bid + Costs):
                    </span>
                    <span className="text-base text-neutral-900">
                      {formatCurrency(bidAmount + totalEstimatedCosts)}
                    </span>
                  </div>
                </div>

                {/* Final Profit */}
                <div className="pt-2 border-t-2 border-neutral-900">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-900">
                      Expected Profit:
                    </span>
                    <span className="text-lg text-neutral-900">
                      {formatCurrency(calculatedProfit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
