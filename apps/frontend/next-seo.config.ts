// next-seo.config.ts
import { DefaultSeoProps } from "next-seo";

const SEO: DefaultSeoProps = {
  title: "Mazeltov - Buy Airtime Instantly",
  description:
    "Bingwa Sokoni offers affordable data bundles, SMS, and minutes for all your communication needs",

  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "mazeltov, mazeltov LTD, minutes offers, affordable data sms and minutes, safaricom data with okoa, buy bundles online, bingwa sokoni data, bingwa sokoni offers, Buy airtime online, bingwa sokoni, bingwa",
    },
    { name: "author", content: "Nethub" },
    { name: "publisher", content: "NetHub" },
    { name: "creator", content: "NetHub" },
  ],

  canonical: "https://www.mazeltov.co.ke",

  openGraph: {
    type: "website",
    url: "https://www.mazeltov.co.ke",
    siteName: "Mazeltov",
    title: "Mazeltov - Buy Airtime Instantly",
    description:
      "Top-up airtime on Safaricom, Airtel, Telkom and more using Mazeltov's Paybill 4509908. Safe, fast and reliable.",
    images: [
      {
        url: "https://www.mazeltov.co.ke/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mazeltov Airtime - Instant Top-Up",
      },
    ],
  },
};

export default SEO;
