import type { Metadata } from "next";
import "./globals.css";

const head = {
  title: "Onlink Davao — Your Link to Davao",
  description:
    "Discover events, connect with the community, and stay updated on everything happening in Davao City.",
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
  icons: {
    icon: [
      { url: "/assets/logo-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/assets/logo-light.png", media: "(prefers-color-scheme: light)" },
    ],
    apple: "/assets/logo-dark.png",
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
