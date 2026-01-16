// admin/dashboards/listings/EditListingDialog.tsx

import { useState } from "react";
import { updateListing } from "wasp/client/operations";
import type { Listing } from "wasp/entities";
import { Button } from "../../../client/components/ui/button";
import { Input } from "../../../client/components/ui/input";
import { Label } from "../../../client/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../client/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../client/components/ui/select";

type EditListingDialogProps = {
  listing: Listing;
  onClose: () => void;
  onSuccess: () => void;
};

const EditListingDialog = ({
  listing,
  onClose,
  onSuccess,
}: EditListingDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await updateListing({
        id: listing.id,
        status: formData.get("status") as string,
        estimatedMarketValue: parseFloat(
          formData.get("estimatedMarketValue") as string
        ),
        recommendedMaxBid: parseFloat(
          formData.get("recommendedMaxBid") as string
        ),
        absoluteMaxBid: parseFloat(formData.get("absoluteMaxBid") as string),
        damageEstimate: parseFloat(formData.get("damageEstimate") as string),
      } as any);

      onSuccess();
    } catch (error: any) {
      alert("Error updating listing: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit: {listing.year} {listing.make} {listing.model}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={listing.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedMarketValue">
                Estimated Market Value ($)
              </Label>
              <Input
                id="estimatedMarketValue"
                name="estimatedMarketValue"
                type="number"
                step="0.01"
                defaultValue={listing.estimatedMarketValue}
                required
              />
            </div>

            <div>
              <Label htmlFor="recommendedMaxBid">Recommended Max Bid ($)</Label>
              <Input
                id="recommendedMaxBid"
                name="recommendedMaxBid"
                type="number"
                step="0.01"
                defaultValue={listing.recommendedMaxBid}
                required
              />
            </div>

            <div>
              <Label htmlFor="absoluteMaxBid">Absolute Max Bid ($)</Label>
              <Input
                id="absoluteMaxBid"
                name="absoluteMaxBid"
                type="number"
                step="0.01"
                defaultValue={listing.absoluteMaxBid}
                required
              />
            </div>

            <div>
              <Label htmlFor="damageEstimate">Damage Estimate ($)</Label>
              <Input
                id="damageEstimate"
                name="damageEstimate"
                type="number"
                step="0.01"
                defaultValue={listing.damageEstimate}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;
