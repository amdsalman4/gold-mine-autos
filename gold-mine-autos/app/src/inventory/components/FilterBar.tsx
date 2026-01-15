// inventory/components/FilterBar.tsx

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../../client/components/ui/input";
import { Button } from "../../client/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../client/components/ui/select";
import { Label } from "../../client/components/ui/label";
import { cn } from "../../client/utils";

export type FilterOptions = {
  search: string;
  minProfit: number;
  maxBid: number;
  sortBy: "profit" | "auction_date" | "market_value";
  make: string;
};

type FilterBarProps = {
  onFilterChange: (filters: FilterOptions) => void;
};

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    minProfit: 0,
    maxBid: 0,
    sortBy: "profit",
    make: "",
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      search: "",
      minProfit: 0,
      maxBid: 0,
      sortBy: "profit",
      make: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.minProfit > 0 ||
    filters.maxBid > 0 ||
    filters.make !== "";

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
      {/* Main Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium mb-2">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by make, model, VIN..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full md:w-48">
          <Label htmlFor="sortBy" className="text-sm font-medium mb-2">
            Sort By
          </Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger id="sortBy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit">Highest Profit</SelectItem>
              <SelectItem value="auction_date">Auction Date</SelectItem>
              <SelectItem value="market_value">Market Value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full md:w-auto"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {showAdvanced ? "Hide Filters" : "More Filters"}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Min Profit */}
            <div>
              <Label htmlFor="minProfit" className="text-sm font-medium mb-2">
                Min Profit ($)
              </Label>
              <Input
                id="minProfit"
                type="number"
                min={0}
                step={500}
                placeholder="e.g., 2000"
                value={filters.minProfit || ""}
                onChange={(e) =>
                  handleFilterChange("minProfit", Number(e.target.value))
                }
              />
            </div>

            {/* Max Bid Budget */}
            <div>
              <Label htmlFor="maxBid" className="text-sm font-medium mb-2">
                Max Bid Budget ($)
              </Label>
              <Input
                id="maxBid"
                type="number"
                min={0}
                step={1000}
                placeholder="e.g., 10000"
                value={filters.maxBid || ""}
                onChange={(e) =>
                  handleFilterChange("maxBid", Number(e.target.value))
                }
              />
            </div>

            {/* Make Filter */}
            <div>
              <Label htmlFor="make" className="text-sm font-medium mb-2">
                Make
              </Label>
              <Input
                id="make"
                type="text"
                placeholder="e.g., Toyota"
                value={filters.make}
                onChange={(e) => handleFilterChange("make", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
