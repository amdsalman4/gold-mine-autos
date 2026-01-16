// admin/dashboards/listings/ListingsTable.tsx

import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  getAllListingsAdmin,
  deleteListing,
  useQuery,
} from "wasp/client/operations";
import { type Listing } from "wasp/entities";
import { Button } from "../../../client/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../client/components/ui/select";
import LoadingSpinner from "../../layout/LoadingSpinner";
import EditListingDialog from "./EditListingDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../client/components/ui/dialog";

const ListingsTable = () => {
  const { data: listings, isLoading, refetch } = useQuery(getAllListingsAdmin);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteListing({ id });
      refetch();
      setDeletingId(null);
    } catch (error: any) {
      alert("Error deleting listing: " + error.message);
    }
  };

  const filteredListings = listings?.filter((listing: any) => {
    if (statusFilter === "all") return true;
    return listing.status === statusFilter;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Filters */}
        <div className="bg-card border-border rounded-sm border shadow p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-auto">
              Showing {filteredListings?.length || 0} of {listings?.length || 0}{" "}
              listings
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border-border rounded-sm border shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left p-4 font-medium text-sm">Vehicle</th>
                  <th className="text-left p-4 font-medium text-sm">
                    Auction Date
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    Market Value
                  </th>
                  <th className="text-left p-4 font-medium text-sm">Max Bid</th>
                  <th className="text-left p-4 font-medium text-sm">Profit</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">
                    Added By
                  </th>
                  <th className="text-right p-4 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredListings && filteredListings.length > 0 ? (
                  filteredListings.map((listing: any) => (
                    <tr
                      key={listing.id}
                      className="border-b border-border hover:bg-muted/20"
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <a
                            href={listing.auctionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            {listing.year} {listing.make} {listing.model}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="text-sm text-muted-foreground">
                            {listing.trim && `${listing.trim} • `}
                            {listing.kilometers.toLocaleString()} km
                          </span>
                          {listing.vin && (
                            <span className="text-xs text-muted-foreground">
                              {listing.vin}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(listing.auctionDate)}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {formatCurrency(listing.estimatedMarketValue)}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-blue-600 font-medium">
                            {formatCurrency(listing.recommendedMaxBid)}
                          </span>
                          <span className="text-xs text-orange-600">
                            Max: {formatCurrency(listing.absoluteMaxBid)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(listing.profitMargin)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === "active"
                              ? "bg-green-100 text-green-700"
                              : listing.status === "sold"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {((listing as any).addedBy as any)?.email ||
                          ((listing as any).addedBy as any)?.username ||
                          "Unknown"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingListing(listing)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(listing.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No listings found. Click &quot;Add New Listing&quot; to
                      get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingListing && (
        <EditListingDialog
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSuccess={() => {
            refetch();
            setEditingListing(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this listing. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListingsTable;
