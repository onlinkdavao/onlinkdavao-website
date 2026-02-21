import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onlink Davao — Coming Soon",
  description: "Onlink Davao is coming soon. Stay tuned!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>{children}</body>
    </html>
  );
}
