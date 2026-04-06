import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  icons: {
    icon: "/Images/Favicon.png",
  },
  title: "Devang Organics - Pure & Natural Products",
  description: "Premium organic products - Teas, Herbs, Soaps, Pickles and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
