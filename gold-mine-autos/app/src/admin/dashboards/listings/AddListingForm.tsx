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
import { X, FileJson, FormInput } from "lucide-react";

type AddListingFormProps = {
  onClose: () => void;
};

const AddListingForm = ({ onClose }: AddListingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainPoints, setMainPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [mode, setMode] = useState<"json" | "form">("json"); // Default to JSON mode

  // Handle JSON Import
  const handleJsonImport = async () => {
    setIsSubmitting(true);

    try {
      // Parse JSON
      const listingData = JSON.parse(jsonInput);

      // Validate required fields
      const requiredFields = [
        "make",
        "model",
        "year",
        "kilometers",
        "auctionLink",
        "auctionDate",
      ];
      const missingFields = requiredFields.filter(
        (field) => !listingData[field]
      );

      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(", ")}`);
        setIsSubmitting(false);
        return;
      }

      // Convert mainPoints if it's a string to array
      if (
        listingData.mainPoints &&
        typeof listingData.mainPoints === "string"
      ) {
        listingData.mainPoints = [listingData.mainPoints];
      }

      // Ensure mainPoints is an array
      if (!Array.isArray(listingData.mainPoints)) {
        listingData.mainPoints = [];
      }

      // Create the listing
      await createListing({
        make: listingData.make,
        model: listingData.model,
        year: parseInt(listingData.year),
        kilometers: parseInt(listingData.kilometers),
        vin: listingData.vin || undefined,
        trim: listingData.trim || undefined,
        auctionLink: listingData.auctionLink,
        auctionDate: listingData.auctionDate,
        currentHighBid: listingData.currentHighBid
          ? parseFloat(listingData.currentHighBid)
          : undefined,
        currentHighBidder: listingData.currentHighBidder || undefined,
        damageEstimate: parseFloat(listingData.damageEstimate || 0),
        estimatedMarketValue: parseFloat(listingData.estimatedMarketValue || 0),
        recommendedMaxBid: parseFloat(listingData.recommendedMaxBid || 0),
        absoluteMaxBid: parseFloat(listingData.absoluteMaxBid || 0),
        profitMargin: parseFloat(listingData.profitMargin || 0),
        estimatedTotalInvestment: parseFloat(
          listingData.estimatedTotalInvestment || 0
        ),
        mainPoints: listingData.mainPoints || [],
        carGurusLink: listingData.carGurusLink || undefined,
        towingCost: parseFloat(listingData.towingCost || 0),
        detailingCost: parseFloat(listingData.detailingCost || 0),
        extraCosts: parseFloat(listingData.extraCosts || 0),
        repairs: listingData.repairs || null,
        status: listingData.status || "active",
      });

      alert("Listing created successfully from JSON!");
      onClose();
      window.location.reload();
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        alert("Invalid JSON format. Please check your input and try again.");
      } else {
        alert("Error creating listing: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Manual Form Submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

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
        repairs: null,
        status: "active",
      });

      alert("Listing created successfully!");
      onClose();
      window.location.reload();
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

  // Example JSON template
  const exampleJson = {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    kilometers: 85000,
    vin: "1HGBH41JXMN109186",
    trim: "LE",
    auctionLink: "https://auction.com/lot/12345",
    auctionDate: "2026-02-15T14:00:00.000Z",
    currentHighBid: 8500,
    currentHighBidder: "Bidder #5432",
    damageEstimate: 1200,
    estimatedMarketValue: 18000,
    recommendedMaxBid: 12000,
    absoluteMaxBid: 13500,
    profitMargin: 4800,
    estimatedTotalInvestment: 13200,
    mainPoints: ["One owner", "Clean Carfax", "No accidents"],
    carGurusLink: "https://cargurus.com/cars/...",
    towingCost: 150,
    detailingCost: 300,
    extraCosts: 250,
    repairs: {
      items: [
        {
          description: "Front bumper replacement",
          partsLink: "https://rockauto.com/...",
          partsCost: 200,
          labour: 150,
        },
      ],
    },
    status: "active",
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
        {/* Mode Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={mode === "json" ? "default" : "outline"}
            onClick={() => setMode("json")}
            className="flex-1"
          >
            <FileJson className="w-4 h-4 mr-2" />
            JSON Import
          </Button>
          <Button
            type="button"
            variant={mode === "form" ? "default" : "outline"}
            onClick={() => setMode("form")}
            className="flex-1"
          >
            <FormInput className="w-4 h-4 mr-2" />
            Manual Form
          </Button>
        </div>

        {/* JSON Import Mode */}
        {mode === "json" && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Paste your LLM-generated JSON below. Required fields: make,
                model, year, kilometers, auctionLink, auctionDate
              </p>
              <details className="text-xs">
                <summary className="cursor-pointer text-primary hover:underline">
                  Show example JSON format
                </summary>
                <pre className="mt-2 p-2 bg-background rounded border overflow-x-auto">
                  {JSON.stringify(exampleJson, null, 2)}
                </pre>
              </details>
            </div>

            <div>
              <Label htmlFor="jsonInput">JSON Data</Label>
              <Textarea
                id="jsonInput"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={15}
                placeholder='{"make": "Toyota", "model": "Camry", ...}'
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleJsonImport}
                disabled={!jsonInput || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Import & Create Listing"}
              </Button>
            </div>
          </div>
        )}

        {/* Manual Form Mode */}
        {mode === "form" && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Vehicle Information
              </h3>
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
              <h3 className="text-lg font-semibold mb-3">
                Main Selling Points
              </h3>
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
        )}
      </CardContent>
    </Card>
  );
};

export default AddListingForm;
