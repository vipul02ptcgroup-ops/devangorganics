import PolicyPage from "@/components/policies/PolicyPage";

export default function CookiePolicyPage() {
  return (
    <PolicyPage
      eyebrow="Cookies"
      title="Cookie Policy"
      intro="This policy explains how cookies and similar storage tools help Devang Organics remember sessions, preferences, and essential storefront interactions."
      sections={[
        {
          title: "What Cookies Do",
          body: [
            "Cookies and local browser storage may be used to remember your session state, cart interactions, and interface preferences.",
            "These tools help keep the site functional and reduce the need to re-enter information during normal browsing.",
          ],
        },
        {
          title: "Functional Usage",
          body: [
            "Essential site features such as sign-in state, protected routing, and some storefront conveniences may rely on browser storage or session information.",
            "We use this information to support customer convenience and secure site access rather than to expose sensitive admin credentials.",
          ],
        },
        {
          title: "Managing Preferences",
          body: [
            "You can clear or block cookies in your browser settings, though some site features may no longer work as expected.",
            "If you need help understanding site behavior after clearing browser data, contact support.",
          ],
        },
      ]}
    />
  );
}
