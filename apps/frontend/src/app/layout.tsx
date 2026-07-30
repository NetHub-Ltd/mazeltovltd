import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/layoutclient";

export const metadata: Metadata = {
  title: "Mazeltov - Instant Airtime & Data Top-Up in Kenya",
  description:
    "Buy airtime, data bundles, SMS, and minutes instantly with Mazeltov. Top-up Safaricom, Airtel, and Telkom using Paybill 572 2222. Fast, secure, and reliable online airtime service in Kenya.",
  icons: {
    icon: "/favicon.png", // your PNG favicon
    shortcut: "/favicon.png", // for older browsers
    apple: "/favicon.png", // used by iOS home screen
  },

  keywords: [
    "Mazeltov Kenya",
    "buy airtime online Kenya",
    "instant airtime top-up",
    "affordable data bundles",
    "Safaricom Airtime Paybill 572 2222",
    "Airtel airtime purchase",
    "Telkom data bundles",
    "cheap SMS bundles Kenya",
    "fast online airtime recharge",
    "best airtime app Kenya",
  ],
  authors: [{ name: "Nethub", url: "https://nethub.co.ke" }],
  creator: "NetHub",
  publisher: "NetHub",
  metadataBase: new URL("https://mazeltov.co.ke"),
  alternates: {
    canonical: "https://mazeltov.co.ke",
  },
  openGraph: {
    title: "Mazeltov - Instant Airtime & Data Top-Up in Kenya",
    description:
      "Top-up airtime and bundles on Safaricom, Airtel, Telkom, and more with Mazeltov Paybill 572 2222. Safe, fast, and reliable.",
    url: "https://mazeltov.co.ke",
    siteName: "Mazeltov",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mazeltov Airtime - Instant Online Top-Up",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mazeltov - Buy Airtime & Bundles Instantly",
    description:
      "Buy airtime and bundles instantly with Mazeltov. Available for Safaricom, Airtel, Telkom, and more using Paybill 5722222 and 5700700.",

    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="font-sans bg-gradient-to-r from-blue-50 via-white to-blue-100"
    >
      <body className="antialiased flex flex-col min-h-screen ">
        {/* Optional structured data injection */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How do I buy airtime online in Kenya with Mazeltov?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Choose your network (Safaricom, Airtel, or Telkom), enter your phone number, pay via M-Pesa Paybill 5700700, and receive your airtime instantly.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What are the benefits of Mazeltov’s affordable data bundles?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Mazeltov provides daily, weekly, and monthly data bundles at affordable rates. Payments are made securely via Paybill 5722222 for instant delivery.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I send bulk SMS in Kenya with Mazeltov?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Mazeltov offers bulk SMS services for OTPs, alerts, and marketing campaigns with fast and reliable delivery across all networks.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Mazeltov support buying voice minutes?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, Mazeltov allows customers to purchase voice minute bundles online for both business and personal use.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Mazeltov safe for online payments?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. All transactions are secured via official M-Pesa Paybill numbers 5722222 and 5700700, ensuring fast and safe payments.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: `${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "http://localhost:3000"
                    }/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Products",
                    item: `https://mazeltov.co.ke/products`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Data Bundles",
                    item: "https://mazeltov.co.ke/products/data",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "SMS Bundles",
                    item: "https://mazeltov.co.ke/products/sms",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Minutes",
                    item: "https://mazeltov.co.ke/products/minutes",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Buy Airtime",
                    item: "https://mazeltov.co.ke/products/airtime",
                  },
                ],
              },
              null,
              2
            ),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Mazeltov",
                url: "https://mazeltov.co.ke",
                logo: "https://mazeltov.co.ke/logo.png",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+254791178111",
                  contactType: "Customer Service",
                  areaServed: "KE",
                },
                sameAs: [
                  "https://www.facebook.com/mazeltov34",
                  "https://twitter.com/mazeltov",
                  "https://www.tiktok.com/@mazeltov2024?",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                name: "Mazeltov Airtime & Data Top-Up",
                description:
                  "Instant airtime, data, SMS, and minutes top-up for Safaricom, Airtel, and Telkom in Kenya. Secure and fast online recharge using Paybill 5722222 and 5700700.",
                provider: {
                  "@type": "Organization",
                  name: "Mazeltov",
                  url: "https://mazeltov.co.ke",
                  logo: "https://mazeltov.co.ke/logo.png",
                },
                areaServed: {
                  "@type": "Country",
                  name: "Kenya",
                },
                serviceType: "Airtime & Data Recharge",
                offers: [
                  {
                    "@type": "Offer",
                    name: "Bingwa Sokoni",
                    url: "https://mazeltov.co.ke/products",
                    priceCurrency: "KES",
                    price: "5",
                    eligibleRegion: { "@type": "Country", name: "Kenya" },
                    availability: "https://schema.org/InStock",
                    paymentAccepted: "M-Pesa Paybill 5722222",
                  },
                  {
                    "@type": "Offer",
                    name: "Airtime Top-up",
                    url: "https://mazeltov.co.ke/products/airtime",
                    priceCurrency: "KES",
                    price: "5",
                    eligibleRegion: { "@type": "Country", name: "Kenya" },
                    availability: "https://schema.org/InStock",
                    paymentAccepted: "M-Pesa Paybill 5700700",
                  },
                ],
              },
            ]),
          }}
        />

        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
