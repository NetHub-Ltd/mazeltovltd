// "use client";
// import React from "react";
// import Link from "next/link";

// const Blog = () => {
//   const howToData = [
//     {
//       "@context": "https://schema.org",
//       "@type": "HowTo",
//       name: "How to Buy Airtime Online with Mazeltov",
//       description:
//         "Step-by-step guide on how to buy airtime instantly with Mazeltov in Kenya.",
//       supply: {
//         "@type": "HowToSupply",
//         name: "M-Pesa STK Push, Paybill 5700700",
//       },
//       step: [
//         {
//           "@type": "HowToStep",
//           name: "Visit Mazeltov Airtime Page",
//           text: "Go to https://mazeltov.co.ke/products/airtime.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Airtime Amount",
//           text: "Provide the airtime amount you want to purchase.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Receiving Number",
//           text: "This number will get the airtime.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Paying Number",
//           text: "This number will receive the STK push for payment.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Confirm Payment",
//           text: "Approve the STK push and receive airtime instantly.",
//         },
//       ],
//     },
//     {
//       "@context": "https://schema.org",
//       "@type": "HowTo",
//       name: "How to Buy Data Bundles with Mazeltov",
//       description:
//         "Guide for buying data bundles instantly on Mazeltov for Safaricom, Airtel, and Telkom.",
//       supply: {
//         "@type": "HowToSupply",
//         name: "M-Pesa STK Push, Paybill 5722222",
//       },
//       step: [
//         {
//           "@type": "HowToStep",
//           name: "Go to Data Bundles Page",
//           text: "Visit https://mazeltov.co.ke/products/data.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Select Data Bundle Offer",
//           text: "Choose the bundle you want (daily, weekly, monthly).",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Paying Number",
//           text: "This number will receive the STK push for payment.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Receiving Number",
//           text: "The bundle will be sent to this number.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Confirm Payment",
//           text: "Approve the STK push to complete the purchase.",
//         },
//       ],
//     },
//     {
//       "@context": "https://schema.org",
//       "@type": "HowTo",
//       name: "How to Buy SMS Packages with Mazeltov",
//       description:
//         "Step-by-step process to purchase SMS bundles with Mazeltov online and offline.",
//       supply: {
//         "@type": "HowToSupply",
//         name: "M-Pesa STK Push, Paybill 5722222",
//       },
//       step: [
//         {
//           "@type": "HowToStep",
//           name: "Visit SMS Packages Page",
//           text: "Go to https://mazeltov.co.ke/products/sms.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Choose SMS Package",
//           text: "Select the SMS package you want.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Paying Number",
//           text: "This number will get the STK push for payment.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Receiving Number",
//           text: "The SMS package will be activated for this line.",
//         },
//       ],
//     },
//     {
//       "@context": "https://schema.org",
//       "@type": "HowTo",
//       name: "How to Buy Voice Minutes with Mazeltov",
//       description:
//         "Simple steps for buying voice minute bundles with Mazeltov for personal and business use.",
//       supply: {
//         "@type": "HowToSupply",
//         name: "M-Pesa STK Push, Paybill 5722222",
//       },
//       step: [
//         {
//           "@type": "HowToStep",
//           name: "Go to Voice Minutes Page",
//           text: "Visit https://mazeltov.co.ke/products/minutes.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Choose Minute Bundle",
//           text: "Select your preferred voice bundle.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Paying Number",
//           text: "Provide the paying number to receive the STK push.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Enter Receiving Number",
//           text: "This line will be topped up with the minutes.",
//         },
//         {
//           "@type": "HowToStep",
//           name: "Confirm Payment",
//           text: "Approve the STK push and enjoy instant calling minutes.",
//         },
//       ],
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Blog Title */}
//         <header className="text-center mb-10">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">
//             How to Buy Airtime, Data, SMS, and Minutes Instantly with Mazeltov
//           </h1>
//           <p className="text-lg text-gray-700">
//             Follow these simple steps to stay connected — whether you’re online
//             or using M-Pesa Paybill. Mazeltov makes it fast, secure, and
//             convenient.
//           </p>
//         </header>

//         {/* Sections */}
//         <section className="space-y-12">
//           {/* Airtime */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-semibold mb-3">
//               1. Buy Airtime Online
//             </h2>
//             <ol className="list-decimal list-inside space-y-2 text-gray-700">
//               <li><Link  href="/products">Go to the Buy Airtime page</Link></li>
//               <li>Enter the airtime amount.</li>
//               <li>Provide the receiving number.</li>
//               <li>Enter the paying number.</li>
//               <li>Confirm via M-Pesa STK push.</li>
//             </ol>
//             <p className="mt-3 text-sm text-gray-600">
//               Offline option: Use Paybill <strong>5700700</strong>, account =
//               receiving number.
//             </p>
//           </div>

//           {/* Data */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-semibold mb-3">2. Buy Data Bundles</h2>
//             <ol className="list-decimal list-inside space-y-2 text-gray-700">
//               <li>Go to the Data Bundles page.</li>
//               <li>Select your bundle (daily, weekly, monthly).</li>
//               <li>Enter the paying number.</li>
//               <li>Enter the receiving number.</li>
//               <li>Confirm via M-Pesa STK push.</li>
//             </ol>
//             <p className="mt-3 text-sm text-gray-600">
//               Offline option: Use Paybill <strong>5722222</strong>, account =
//               receiving number.
//             </p>
//           </div>

//           {/* SMS */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-semibold mb-3">3. Buy SMS Packages</h2>
//             <ol className="list-decimal list-inside space-y-2 text-gray-700">
//               <li>Visit the SMS Packages page.</li>
//               <li>Select the SMS package you want.</li>
//               <li>Enter the paying number.</li>
//               <li>Enter the receiving number.</li>
//               <li>Confirm via M-Pesa STK push.</li>
//             </ol>
//             <p className="mt-3 text-sm text-gray-600">
//               Offline option: Use Paybill <strong>5722222</strong>, account =
//               receiving number.
//             </p>
//           </div>

//           {/* Minutes */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-semibold mb-3">
//               4. Buy Voice Minutes
//             </h2>
//             <ol className="list-decimal list-inside space-y-2 text-gray-700">
//               <li>Go to the Voice Minutes page.</li>
//               <li>Choose your bundle.</li>
//               <li>Enter the paying number.</li>
//               <li>Enter the receiving number.</li>
//               <li>Confirm via M-Pesa STK push.</li>
//             </ol>
//             <p className="mt-3 text-sm text-gray-600">
//               Offline option: Use Paybill <strong>5722222</strong>, account =
//               receiving number.
//             </p>
//           </div>
//         </section>
//       </div>

//       {/* Inject JSON-LD for HowTo schema */}
//       {howToData.map((schema, i) => (
//         <script
//           key={i}
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//         />
//       ))}
//     </main>
//   );
// };

// export default Blog;


"use client";
import React from "react";
import Link from "next/link";

const Blog = () => {
  const howToData = [
    // Card 1: Bingwa Sokoni Offers
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Buy Bingwa Sokoni Data, SMS, and Minutes Online",
      description:
        "Step-by-step guide to buying Bingwa Sokoni offers online with Mazeltov Kenya.",
      supply: {
        "@type": "HowToSupply",
        name: "M-Pesa STK Push, Paybill 5722222",
      },
      step: [
        {
          "@type": "HowToStep",
          name: "Visit Product Page",
          text: "Go to the Data, SMS, or Voice Minutes page for Bingwa Sokoni offers: https://mazeltov.co.ke/products/data, https://mazeltov.co.ke/products/sms, https://mazeltov.co.ke/products/minutes.",
        },
        {
          "@type": "HowToStep",
          name: "Select Offer",
          text: "Choose the offer you want. You must pay the exact offer amount.",
        },
        {
          "@type": "HowToStep",
          name: "Provide Paying Number",
          text: "Enter your number to receive the M-Pesa STK push for payment (e.g., 0712 345 678).",
        },
        {
          "@type": "HowToStep",
          name: "Confirm Payment",
          text: "Approve the M-Pesa STK push and receive your Bingwa Sokoni offer instantly.",
        },
      ],
    },

    // Card 2: Airtime
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Buy Airtime Online with Mazeltov",
      description:
        "Step-by-step guide to buying airtime online in Kenya with automatic network detection.",
      supply: {
        "@type": "HowToSupply",
        name: "M-Pesa STK Push, Paybill 5700700",
      },
      step: [
        {
          "@type": "HowToStep",
          name: "Visit Airtime Page",
          text: "Go to https://mazeltov.co.ke/products/airtime.",
        },
        {
          "@type": "HowToStep",
          name: "Enter Amount",
          text: "Type the amount of airtime you want to buy.",
        },
        {
          "@type": "HowToStep",
          name: "Provide Receiving Number",
          text: "Enter the number to receive airtime (e.g., 0712 345 678). Network is detected automatically.",
        },
        {
          "@type": "HowToStep",
          name: "Provide Paying Number",
          text: "Enter the number to receive the STK push.",
        },
        {
          "@type": "HowToStep",
          name: "Confirm Payment",
          text: "Approve the M-Pesa STK push and get your airtime instantly.",
        },
      ],
    },

    // Card 3: Offline Recharge
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Recharge Offline with M-Pesa Paybill",
      description:
        "Step-by-step guide to offline recharge of airtime or Bingwa Sokoni offers using M-Pesa.",
      supply: {
        "@type": "HowToSupply",
        name: "M-Pesa Paybill",
      },
      step: [
        {
          "@type": "HowToStep",
          name: "Go to M-Pesa",
          text: "Open M-Pesa on your phone and select Lipa na M-Pesa → Paybill.",
        },
        {
          "@type": "HowToStep",
          name: "Enter Business Number",
          text: "Enter the business number: 5700700 for airtime, 5722222 for Bingwa Sokoni offers.",
        },
        {
          "@type": "HowToStep",
          name: "Enter Account Number",
          text: "Account number = the number you want to recharge (e.g., 0712 345 678).",
        },
        {
          "@type": "HowToStep",
          name: "Enter Amount",
          text: "For Bingwa Sokoni offers, pay the exact offer amount. For airtime, type your desired amount.",
        },
        {
          "@type": "HowToStep",
          name: "Submit",
          text: "Confirm the transaction and complete your recharge.",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Blog Title */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How to Buy Airtime, Data, SMS, and Minutes Instantly with Mazeltov
          </h1>
          <p className="text-lg text-gray-700 space-y-2">
            Mazeltov Kenya makes it easy to{" "}
            <strong>buy airtime online in Kenya</strong> and enjoy
            <strong> instant airtime top-up</strong>. Explore our{" "}
            <Link href="/products/data" className="underline text-blue-600">
              affordable data bundles
            </Link>
            ,{" "}
            <Link href="/products/sms" className="underline text-blue-600">
              cheap SMS bundles Kenya
            </Link>
            , and Bingwa Sokoni voice offers. Whether using{" "}
            <strong>Safaricom Airtime Paybill 572 2222</strong> or{" "}
            <strong>Airtel airtime purchase</strong>, Mazeltov ensures a{" "}
            <strong>fast online airtime recharge</strong> experience, making it
            the <strong>best airtime website</strong> for everyone.
          </p>
        </header>

        <section className="space-y-12">
          {/* Card 1: Bingwa Sokoni */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              1. Buy Bingwa Sokoni Offers Online
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Visit the product pages:{" "}
                <Link href="/products/data" className="underline text-blue-600">
                  Data
                </Link>
                ,{" "}
                <Link href="/products/sms" className="underline text-blue-600">
                  SMS
                </Link>
                ,{" "}
                <Link
                  href="/products/minutes"
                  className="underline text-blue-600"
                >
                  Minutes
                </Link>
                .
              </li>
              <li>Select the offer you want (pay the exact offer amount).</li>
              <li>
                Enter your paying number to receive the M-Pesa STK push (e.g.,
                0712 345 678).
              </li>
              <li>Approve the STK push to receive your offer instantly.</li>
            </ol>
          </div>

          {/* Card 2: Airtime */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              2. Buy Airtime Online
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Visit the{" "}
                <Link
                  href="/products/airtime"
                  className="underline text-blue-600"
                >
                  Buy Airtime
                </Link>{" "}
                page.
              </li>
              <li>Enter the amount you want to top-up.</li>
              <li>
                Provide the receiving number (network detected automatically).
              </li>
              <li>Enter your paying number to get the STK push.</li>
              <li>Approve the STK push to recharge instantly.</li>
            </ol>
          </div>

          {/* Card 3: Offline Recharge */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">
              3. Offline Recharge via M-Pesa
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Open M-Pesa and select Lipa na M-Pesa → Paybill.</li>
              <li>
                Enter business number: 5700700 for Airtime, 5722222 for Bingwa
                Sokoni offers.
              </li>
              <li>
                Account number = the number you want to recharge (e.g., 0712 345
                678).
              </li>
              <li>
                Enter the amount (exact offer amount for Bingwa, desired amount
                for airtime).
              </li>
              <li>Submit to complete the transaction.</li>
            </ol>
          </div>
        </section>
      </div>

      {/* Inject JSON-LD for HowTo schema */}
      {howToData.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </main>
  );
};

export default Blog;
