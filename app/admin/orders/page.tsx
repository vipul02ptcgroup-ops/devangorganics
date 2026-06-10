"use client";

import { ShoppingBag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";

export default function AdminOrders() {
  return (
    <AdminLayout>
      <AdminPlaceholder
        eyebrow="FULFILLMENT"
        title="Orders"
        description="A clean placeholder for future order management. The route is already protected for admins and can later hold tracking, status, and fulfillment tools."
        Icon={ShoppingBag}
        highlights={[
          "Order search, filters, and status updates can be added here later.",
          "This placeholder keeps the current admin structure lightweight for now.",
          "The layout already matches the rest of the admin experience.",
        ]}
      />
    </AdminLayout>
  );
}
