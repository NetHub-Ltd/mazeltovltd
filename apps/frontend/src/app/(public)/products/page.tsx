import React from "react";
import OfferCardsWrapper from "@/components/OfferCardsWrapper";

export const metadata = {
  title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
  description:
    "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
  keywords: [
    "safaricom airtime",
    "buy airtime online",
    "buy airtime online Kenya",
    "where to buy airtime online",
  ],
  openGraph: {
    title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
    description:
      "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
    type: "website",
    url: `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/services`,
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/images/mazeltov-services-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Mazeltov Connectivity Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
    description:
      "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
    images: [
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/images/mazeltov-services-twitter.jpg`,
    ],
  },
};

export default function ServicesPage() {
  return (
    <main className="">
      <OfferCardsWrapper />
    </main>
  );
}
