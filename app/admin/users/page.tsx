"use client";

import { Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";

export default function AdminUsers() {
  return (
    <AdminLayout>
      <AdminPlaceholder
        eyebrow="ACCOUNTS"
        title="Users"
        description="A clean placeholder for future user management. This is the natural place to review customer accounts, roles, and admin access later."
        Icon={Users}
        highlights={[
          "List users from Firestore here when you are ready to manage accounts.",
          "Role review and manual admin assignment tools can live on this page later.",
          "The route is admin-only and fits the existing design language.",
        ]}
      />
    </AdminLayout>
  );
}
