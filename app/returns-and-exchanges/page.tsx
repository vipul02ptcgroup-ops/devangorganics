import PolicyPage from "@/components/policies/PolicyPage";

export default function ReturnsAndExchangesPage() {
  return (
    <PolicyPage
      eyebrow="Returns"
      title="Returns and Exchanges"
      intro="This page explains the general approach to returns, exchanges, and support when an order arrives damaged, incorrect, or unsuitable."
      sections={[
        {
          title: "Eligible Requests",
          body: [
            "If you receive the wrong item, a damaged product, or an order issue caused during fulfillment, contact support promptly with the order number and clear details.",
            "Eligibility for return or exchange may depend on product condition, timing, and category-specific hygiene or safety considerations.",
          ],
        },
        {
          title: "Review Process",
          body: [
            "Each request is reviewed individually to verify the issue and determine the best resolution, which may include replacement, exchange, or another support option.",
            "Photos, delivery details, or account information may be requested to help complete the review quickly.",
          ],
        },
        {
          title: "How to Contact Us",
          body: [
            "Please use the contact page or registered store contact details for return and exchange requests.",
            "Include your name, order number, product details, and a short explanation so the support team can respond efficiently.",
          ],
        },
      ]}
    />
  );
}
