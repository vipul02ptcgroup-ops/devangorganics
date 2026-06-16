import PolicyPage from "@/components/policies/PolicyPage";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This policy explains how Devang Organics collects, uses, and protects customer information across the storefront, account area, and backend-connected services."
      sections={[
        {
          title: "Information We Collect",
          body: [
            "We may collect your name, email, phone number, shipping address, account identity details, and order activity when you browse, sign in, subscribe to the newsletter, create a wishlist, or place an order.",
            "Technical details such as device, browser, and usage information may also be collected to keep the platform secure and improve the shopping experience.",
          ],
        },
        {
          title: "How We Use Data",
          body: [
            "We use your information to manage orders, maintain your account, operate wishlist and newsletter features, respond to support requests, and improve store performance.",
            "Administrative access to customer and order information is restricted to authorized roles and backend-controlled flows.",
          ],
        },
        {
          title: "Security and Retention",
          body: [
            "Sensitive admin credentials are not exposed to the frontend. Protected backend APIs are used for role updates, wishlist access, newsletter submissions, and order storage.",
            "We retain information only as long as it is needed for legitimate business, legal, or customer-service purposes.",
          ],
        },
      ]}
    />
  );
}
