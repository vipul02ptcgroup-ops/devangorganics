import PolicyPage from "@/components/policies/PolicyPage";

export default function FaqPage() {
  return (
    <PolicyPage
      eyebrow="Help"
      title="Frequently Asked Questions"
      intro="Common questions about products, ordering, wishlist activity, account access, and support are collected here for quick reference."
      sections={[
        {
          title: "Orders",
          body: [
            "Orders are submitted through protected backend APIs and stored securely. After checkout, you can review your order history from your profile page.",
            "If you need help with an order, contact support with the order number shown on your confirmation or profile page.",
          ],
        },
        {
          title: "Wishlist and Accounts",
          body: [
            "Signed-in users can add or remove items from their wishlist, and those entries are connected through backend APIs.",
            "Your profile page shows your saved wishlist products, while admin users can review product-level wishlist interest through the admin panel.",
          ],
        },
        {
          title: "Products and Pricing",
          body: [
            "Some products may display price on request if pricing has not been added yet. Product details are shown only when data is available in the catalog.",
            "Stock, ratings, and benefits may vary by product depending on the information currently stored.",
          ],
        },
      ]}
    />
  );
}
