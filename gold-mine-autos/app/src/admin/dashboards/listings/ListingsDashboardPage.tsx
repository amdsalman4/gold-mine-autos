import { type AuthUser } from "wasp/auth";
import Breadcrumb from "../../layout/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import ListingsTable from "./ListingsTable";
import { useState } from "react";
import { Button } from "../../../client/components/ui/button";
import { Plus } from "lucide-react";
import AddListingForm from "./AddListingForm";

const AdminListings = ({ user }: { user: AuthUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Listings" />

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Inventory Listings</h2>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </div>

        {showAddForm && (
          <AddListingForm onClose={() => setShowAddForm(false)} />
        )}

        <ListingsTable />
      </div>
    </DefaultLayout>
  );
};

export default AdminListings;
