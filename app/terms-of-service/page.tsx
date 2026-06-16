import PolicyPage from "@/components/policies/PolicyPage";

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms govern access to the Devang Organics website, customer accounts, and purchases made through the platform."
      sections={[
        {
          title: "Use of the Website",
          body: [
            "You agree to provide accurate information when creating an account, subscribing to updates, or placing an order.",
            "You may not misuse the site, attempt unauthorized access, or interfere with the store, admin features, or backend APIs.",
          ],
        },
        {
          title: "Orders and Availability",
          body: [
            "Product descriptions, pricing, stock, and availability are shown as accurately as possible based on current catalog data, but they may change without prior notice.",
            "We reserve the right to cancel or adjust orders if there is an issue with availability, pricing, payment, or suspected misuse.",
          ],
        },
        {
          title: "Accounts and Roles",
          body: [
            "Customers are responsible for keeping their login access secure. Admin privileges are assigned only through authorized backend processes.",
            "Any misuse of customer or admin access may result in account suspension or removal.",
          ],
        },
      ]}
    />
  );
}
