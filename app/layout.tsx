import type { Metadata } from "next";
import "./globals.css";

const head = {
  title: "Onlink Davao — Coming Soon",
  description: "Onlink Davao is coming soon. Stay tuned!",
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onlinkdavao.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `%s | ${head.title}`,
    default: head.title,
  },
  keywords: ["Onlink Davao", "OnlinkDavao"],
  description: head.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    ...head,
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FB_APP_ID || "",
  },
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
