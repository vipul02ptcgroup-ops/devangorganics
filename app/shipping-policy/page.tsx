import PolicyPage from "@/components/policies/PolicyPage";

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Shipping"
      title="Shipping Policy"
      intro="This page outlines how Devang Organics handles order processing, dispatch timing, and delivery expectations."
      sections={[
        {
          title: "Processing Time",
          body: [
            "Orders are reviewed after successful submission and are processed according to product availability and internal fulfillment timelines.",
            "During high-demand periods or limited-stock situations, processing may take longer than usual.",
          ],
        },
        {
          title: "Delivery Expectations",
          body: [
            "Estimated delivery windows may vary by destination, courier coverage, and local conditions.",
            "Tracking or delivery updates may be shared after the order has moved into the next fulfillment stage.",
          ],
        },
        {
          title: "Address Accuracy",
          body: [
            "Customers should provide a complete and correct shipping address, phone number, and contact details during checkout.",
            "Incorrect or incomplete delivery details may delay shipping or require manual confirmation.",
          ],
        },
      ]}
    />
  );
}
