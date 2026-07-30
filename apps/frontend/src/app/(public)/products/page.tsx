// import React from "react";
// import OfferCardsWrapper from "@/components/OfferCardsWrapper";

// export const metadata = {
//   title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
//   description:
//     "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
//   keywords: [
//     "safaricom airtime",
//     "buy airtime online",
//     "buy airtime online Kenya",
//     "where to buy airtime online",
//   ],
//   openGraph: {
//     title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
//     description:
//       "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
//     type: "website",
//     url: `${
//       process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//     }/services`,
//     images: [
//       {
//         url: `${
//           process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//         }/images/mazeltov-services-og.jpg`,
//         width: 1200,
//         height: 630,
//         alt: "Mazeltov Connectivity Services",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
//     description:
//       "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
//     images: [
//       `${
//         process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//       }/images/mazeltov-services-twitter.jpg`,
//     ],
//   },
// };

// export default function ServicesPage() {
//   return (
//     <main className="">
//       <OfferCardsWrapper />
//     </main>
//   );
// }

import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
  description:
    "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
  keywords: [
    "safaricom airtime",
    "buy airtime online",
    "buy airtime online Kenya",
    "where to buy airtime online",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
    description:
      "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya. Get instant connectivity solutions.",
    type: "website",
    url: "/products",
    images: [
      {
        url: "/images/mazeltov-services-og.jpg",
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
    images: ["/images/mazeltov-services-twitter.jpg"],
  },
};

export default function ProductsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mazeltov Services - Data, Minutes & SMS Deals in Kenya",
    description:
      "Explore Mazeltov's 'Bingwa Sokoni Deals' for affordable data bundles, voice minutes, and SMS packages across all mobile networks in Kenya.",
    url: new URL("/products", baseUrl).toString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Mazeltov Connectivity Services
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Affordable data bundles, voice minutes, and SMS packages in Kenya.
          </p>
        </header>

        <section aria-label="Available Deals" className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Bingwa Sokoni Deals
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Static test view active. Select services will appear here once verified.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}