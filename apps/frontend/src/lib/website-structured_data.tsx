export const globalJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mazeltov LTD",
    url: "https://mazeltov.co.ke",
    logo: "https://mazeltov.co.ke/logo.png",
    sameAs: [
      "https://www.facebook.com/mazeltov34?_rdc=1&_rdr#",
      "https://www.tiktok.com/@mazeltov2024?",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254791178111",
      contactType: "customer service",
      areaServed: "KE",
      availableLanguage: "en",
    },
  },
];

export const homepagejsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mazeltov LTD",
    url: "https://mazeltov.co.ke",
    logo: "https://mazeltov.co.ke/logo.png",
    sameAs: [
      "https://www.facebook.com/mazeltov34?_rdc=1&_rdr#",
      "https://www.tiktok.com/@mazeltov2024?",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254791178111",
      contactType: "customer service",
      areaServed: "KE",
      availableLanguage: "en",
    },
  },
];

export const smsJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Bingwa SMS Bundles",
  description:
    "Buy SMS bundles usable across all Kenyan networks via Safaricom Bingwa.",
  brand: {
    "@type": "Brand",
    name: "Safaricom",
  },
  potentialAction: {
    "@type": "BuyAction",
    target: "https://mazeltov.co.ke/product/sms",
  },
  offers: [
    {
      "@type": "Offer",
      name: "100 SMS Bundle",
      url: "https://bingwa.safaricom.co.ke/sms/100",
      priceCurrency: "KES",
      price: "5",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "500 SMS Bundle",
      url: "https://bingwa.safaricom.co.ke/sms/500",
      priceCurrency: "KES",
      price: "20",
      availability: "https://schema.org/InStock",
    },
  ],
};

export const productsjsonLd = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "Bingwa Sokoni Data Deals",
  brand: {
    "@type": "Brand",
    name: "Mazeltov LTD",
  },
  description:
    "Buy affordable data bundles for your mobile network. Get instant connectivity solutions.",
  image: "https://mazeltov.co.ke/images/logo.png",
  offers: {
    "@type": "AggregateOffer",
    url: "https://mazeltov.co.ke/products/",
    priceCurrency: "KES",
    highPrice: "1001.00",
    lowPrice: "18.00",
    offerCount: "15",
    availability: "https://schema.org/InStock",
  },
};
