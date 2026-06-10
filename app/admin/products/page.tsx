"use client";

import { Package } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";

export default function AdminProducts() {
  return (
    <AdminLayout>
      <AdminPlaceholder
        eyebrow="CATALOG"
        title="Products"
        description="A clean placeholder for future product management. This page keeps the existing admin theme and is ready for live inventory or CRUD tooling later."
        Icon={Package}
        highlights={[
          "Add product list, filters, and category controls here.",
          "Connect this screen to Firestore, an API, or your preferred backend when ready.",
          "Use the existing gold-on-black admin styling to stay visually consistent.",
        ]}
      />
    </AdminLayout>
  );
}
