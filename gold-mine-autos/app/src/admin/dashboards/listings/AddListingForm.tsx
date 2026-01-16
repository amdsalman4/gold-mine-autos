// admin/dashboards/listings/AddListingForm.tsx

import { useState } from "react";
import { createListing } from "wasp/client/operations";
import { Button } from "../../../client/components/ui/button";
import { Input } from "../../../client/components/ui/input";
import { Label } from "../../../client/components/ui/label";
import { Textarea } from "../../../client/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../client/components/ui/card";
import { X } from "lucide-react";

type AddListingFormProps = {
  onClose: () => void;
};

const AddListingForm = ({ onClose }: AddListingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainPoints, setMainPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Calculate profit margin and total investment
    const estimatedMarketValue = parseFloat(
      formData.get("estimatedMarketValue") as string
    );
    const recommendedMaxBid = parseFloat(
      formData.get("recommendedMaxBid") as string
    );
    const towingCost = parseFloat(formData.get("towingCost") as string) || 0;
    const detailingCost =
      parseFloat(formData.get("detailingCost") as string) || 0;
    const damageEstimate =
      parseFloat(formData.get("damageEstimate") as string) || 0;
    const extraCosts = parseFloat(formData.get("extraCosts") as string) || 0;

    const totalCosts = towingCost + detailingCost + damageEstimate + extraCosts;
    const estimatedTotalInvestment = recommendedMaxBid + totalCosts;
    const profitMargin = estimatedMarketValue - estimatedTotalInvestment;

    try {
      await createListing({
        make: formData.get("make") as string,
        model: formData.get("model") as string,
        year: parseInt(formData.get("year") as string),
        kilometers: parseInt(formData.get("kilometers") as string),
        vin: (formData.get("vin") as string) || undefined,
        trim: (formData.get("trim") as string) || undefined,
        auctionLink: formData.get("auctionLink") as string,
        auctionDate: formData.get("auctionDate") as string,
        currentHighBid:
          parseFloat(formData.get("currentHighBid") as string) || undefined,
        currentHighBidder:
          (formData.get("currentHighBidder") as string) || undefined,
        damageEstimate,
        estimatedMarketValue,
        recommendedMaxBid,
        absoluteMaxBid: parseFloat(formData.get("absoluteMaxBid") as string),
        profitMargin,
        estimatedTotalInvestment,
        mainPoints,
        carGurusLink: (formData.get("carGurusLink") as string) || undefined,
        towingCost,
        detailingCost,
        extraCosts,
        repairs: null, // We'll add repair UI later
        status: "active",
      });

      alert("Listing created successfully!");
      onClose();
      window.location.reload(); // Reload to show new listing
    } catch (error: any) {
      alert("Error creating listing: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMainPoint = () => {
    if (currentPoint.trim()) {
      setMainPoints([...mainPoints, currentPoint.trim()]);
      setCurrentPoint("");
    }
  };

  const removeMainPoint = (index: number) => {
    setMainPoints(mainPoints.filter((_, i) => i !== index));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Listing</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input id="make" name="make" required />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input id="model" name="model" required />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1990"
                  max="2026"
                  required
                />
              </div>
              <div>
                <Label htmlFor="kilometers">Kilometers *</Label>
                <Input
                  id="kilometers"
                  name="kilometers"
                  type="number"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input id="vin" name="vin" />
              </div>
              <div>
                <Label htmlFor="trim">Trim</Label>
                <Input id="trim" name="trim" />
              </div>
            </div>
          </div>

          {/* Auction Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Auction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="auctionLink">Auction Link *</Label>
                <Input
                  id="auctionLink"
                  name="auctionLink"
                  type="url"
                  required
                />
              </div>
              <div>
                <Label htmlFor="auctionDate">Auction Date *</Label>
                <Input
                  id="auctionDate"
                  name="auctionDate"
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currentHighBid">Current High Bid ($)</Label>
                <Input
                  id="currentHighBid"
                  name="currentHighBid"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="currentHighBidder">Current High Bidder</Label>
                <Input
                  id="currentHighBidder"
                  name="currentHighBidder"
                  placeholder="e.g., Bidder #1234"
                />
              </div>
            </div>
          </div>

          {/* Financial Report */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Financial Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedMarketValue">
                  Estimated Market Value ($) *
                </Label>
                <Input
                  id="estimatedMarketValue"
                  name="estimatedMarketValue"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="recommendedMaxBid">
                  Recommended Max Bid ($) *
                </Label>
                <Input
                  id="recommendedMaxBid"
                  name="recommendedMaxBid"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="absoluteMaxBid">Absolute Max Bid ($) *</Label>
                <Input
                  id="absoluteMaxBid"
                  name="absoluteMaxBid"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="damageEstimate">Damage Estimate ($) *</Label>
                <Input
                  id="damageEstimate"
                  name="damageEstimate"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Costs */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Estimated Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="towingCost">Towing Cost ($)</Label>
                <Input
                  id="towingCost"
                  name="towingCost"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                />
              </div>
              <div>
                <Label htmlFor="detailingCost">Detailing Cost ($)</Label>
                <Input
                  id="detailingCost"
                  name="detailingCost"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                />
              </div>
              <div>
                <Label htmlFor="extraCosts">Extra Costs ($)</Label>
                <Input
                  id="extraCosts"
                  name="extraCosts"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                />
              </div>
            </div>
          </div>

          {/* Main Points */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Main Selling Points</h3>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentPoint}
                onChange={(e) => setCurrentPoint(e.target.value)}
                placeholder="e.g., One owner, No accidents"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addMainPoint();
                  }
                }}
              />
              <Button type="button" onClick={addMainPoint}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mainPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {point}
                  <button type="button" onClick={() => removeMainPoint(idx)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Reference Links</h3>
            <div>
              <Label htmlFor="carGurusLink">
                CarGurus Link (for market value reference)
              </Label>
              <Input id="carGurusLink" name="carGurusLink" type="url" />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddListingForm;
