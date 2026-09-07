import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teoriprøver — Danish Driving Theory Practice",
  description:
    "Practice the Danish driving theory test in English. Realistic scenarios, instant explanations, 7-day full access.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
