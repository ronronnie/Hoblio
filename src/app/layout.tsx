import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoblio",
  description: "A modular platform for predefined tracker apps."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
