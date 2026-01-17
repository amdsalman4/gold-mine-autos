// inventory/components/Listing.tsx

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { Button } from "../../client/components/ui/button";
import { cn } from "../../client/utils";
import type { Listing as ListingType, RepairItem } from "../types";

export function Listing({ listing }: { listing: ListingType }) {
  const [showDetails, setShowDetails] = useState(false);
  const [bidAmount, setBidAmount] = useState(listing.recommendedMaxBid);

  // Editable costs state
  const [auctionOverhead, setAuctionOverhead] = useState(500); // Default overhead
  const [towingCost, setTowingCost] = useState(listing.towingCost);
  const [detailingCost, setDetailingCost] = useState(listing.detailingCost);
  const [bufferCosts, setBufferCosts] = useState(listing.extraCosts);
  const [repairItems, setRepairItems] = useState<
    Array<{ description: string; parts: number; labour: number }>
  >(
    (listing.repairs?.items || []).map((r: RepairItem) => ({
      description: r.description,
      parts: r.partsCost,
      labour: r.labour,
    }))
  );

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
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.tagName === "INPUT" ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input")
    ) {
      return;
    }
    window.open(listing.auctionLink, "_blank");
  };

  // Calculations for breakdown
  const costToDoor = bidAmount + auctionOverhead + towingCost;
  const totalRepairItemsCost = repairItems.reduce(
    (sum, item) => sum + item.parts + item.labour,
    0
  );
  const readyToSellTotal =
    costToDoor + totalRepairItemsCost + detailingCost + bufferCosts;
  const calculatedProfit = listing.estimatedMarketValue - readyToSellTotal;

  // Add new repair item
  const addRepairItem = () => {
    setRepairItems([
      ...repairItems,
      { description: "New repair", parts: 0, labour: 0 },
    ]);
  };

  // Remove repair item
  const removeRepairItem = (index: number) => {
    setRepairItems(repairItems.filter((_, i) => i !== index));
  };

  // Update repair item
  const updateRepairItem = (
    index: number,
    field: "description" | "parts" | "labour",
    value: string | number
  ) => {
    const updated = [...repairItems];
    updated[index] = { ...updated[index], [field]: value };
    setRepairItems(updated);
  };

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
            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200 hover:bg-green-200 transition-colors flex items-center gap-1"
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

      {/* Expandable Details Section - COMPLETELY REDESIGNED */}
      {showDetails && (
        <div className="border-t border-neutral-200 bg-white px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* STEP 1: Cost to Door */}
            <div>
              <h3 className="text-sm text-neutral-900 mb-3">Cost to Door</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">If place bid:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-600">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) =>
                        setBidAmount(parseFloat(e.target.value) || 0)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 px-2 py-1 border border-neutral-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">
                    Auction overhead fees:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-600">$</span>
                    <input
                      type="number"
                      value={auctionOverhead}
                      onChange={(e) =>
                        setAuctionOverhead(parseFloat(e.target.value) || 0)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 px-2 py-1 border border-neutral-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Est. towing to door:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-600">$</span>
                    <input
                      type="number"
                      value={towingCost}
                      onChange={(e) =>
                        setTowingCost(parseFloat(e.target.value) || 0)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 px-2 py-1 border border-neutral-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                  <span className="text-neutral-900 font-bold">
                    Cost to door total:
                  </span>
                  <span className="text-neutral-900 font-bold">
                    {formatCurrency(costToDoor)}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 2: Repair Costs */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm text-neutral-900">Repair Costs</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addRepairItem();
                  }}
                  className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add repair
                </button>
              </div>

              <div className="space-y-3 text-sm">
                {repairItems.map((item, idx) => (
                  <div key={idx} className="pb-2 border-b border-neutral-100">
                    <div className="flex justify-between items-start mb-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateRepairItem(idx, "description", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        placeholder="Repair description"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRepairItem(idx);
                        }}
                        className="ml-2 text-neutral-400 hover:text-neutral-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-xs text-neutral-600">
                          Parts: $
                        </span>
                        <input
                          type="number"
                          value={item.parts}
                          onChange={(e) =>
                            updateRepairItem(
                              idx,
                              "parts",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        />
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-xs text-neutral-600">
                          Labour: $
                        </span>
                        <input
                          type="number"
                          value={item.labour}
                          onChange={(e) =>
                            updateRepairItem(
                              idx,
                              "labour",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 border border-neutral-300 rounded text-right text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Detailing:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-600">$</span>
                    <input
                      type="number"
                      value={detailingCost}
                      onChange={(e) =>
                        setDetailingCost(parseFloat(e.target.value) || 0)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 px-2 py-1 border border-neutral-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">
                    Safety cert & buffer costs:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-600">$</span>
                    <input
                      type="number"
                      value={bufferCosts}
                      onChange={(e) =>
                        setBufferCosts(parseFloat(e.target.value) || 0)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 px-2 py-1 border border-neutral-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                  <span className="text-neutral-900 font-bold">
                    Ready to sell total:
                  </span>
                  <span className="text-neutral-900 font-bold">
                    {formatCurrency(readyToSellTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 3: Selling Price & Profit */}
            <div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">
                  Selling price (Market Value):
                </span>
                <span className="text-neutral-900">
                  {formatCurrency(listing.estimatedMarketValue)}
                </span>
              </div>

              <div className="pt-3 border-t-2 border-neutral-900">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-900 font-bold">Profit:</span>
                  <span className="text-neutral-900 font-bold text-lg">
                    {formatCurrency(calculatedProfit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Reference Link */}
            {listing.carGurusLink && (
              <div className="pt-4 border-t border-neutral-200">
                <a
                  href={listing.carGurusLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-900 underline flex items-center gap-1 hover:text-neutral-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  View market value research{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
