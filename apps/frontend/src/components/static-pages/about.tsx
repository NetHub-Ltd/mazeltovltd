import Link from "next/link"; // fixed import, not from lucide-react
import React from "react";

const AboutPage = () => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto py-16">
        {/* Hero */}
        <header className="text-center mb-12">
          <h1 className="mb-4">About Mazeltov Commercial Agency Ltd</h1>
          <p className="max-w-3xl mx-auto">
            Mazeltov is Kenya’s trusted platform to{" "}
            <strong>
              buy airtime online, data bundles, SMS packages, and voice minutes
              instantly
            </strong>
            . We support the major mobile networks in Kenya, delivering{" "}
            <strong>fast, secure, and affordable top-up services</strong> for
            individuals and businesses. Using our Paybill numbers{" "}
            <strong>572 2222</strong> (Bingwa Sokoni) and{" "}
            <strong>570 0700</strong> (airtime top-up), customers enjoy a smooth
            and reliable digital payment experience.
          </p>
        </header>

        {/* What We Do */}
        <section className="bg-white p-4 shadow mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold">Airtime Top-up</h3>
              <p className="mt-1">
                Buy airtime instantly for{" "}
                <strong>Safaricom, Airtel, and Telkom and more</strong>. Our
                platform supports single or bulk airtime top-ups for staff,
                vendors, or personal use. Payments are processed via M-Pesa
                Paybill <strong>5700700</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Data Bundles</h3>
              <p className="mt-1">
                Get <strong>affordable data bundles in Kenya</strong> — daily,
                weekly, monthly, or social bundles — all delivered instantly.
                Perfect for personal use, teams, and remote workers.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Bulk SMS Packages</h3>
              <p className="mt-1">
                Run campaigns or send notifications with our{" "}
                <strong>diverse SMS packages</strong>. Whether for marketing,
                customer support, or business outreach, we have you covered.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Voice Minutes</h3>
              <p className="mt-1">
                Buy <strong>voice minutes online</strong> for customer support,
                business outreach, or personal calling needs.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 text-gray-800">
            <div className="bg-white p-4 rounded-md shadow">
              <p className="font-semibold">
                Q: How do I buy airtime online in Kenya with Mazeltov?
              </p>
              <p className="mt-1">
                A: Simply choose the network (Safaricom, Airtel, or Telkom),
                enter your phone number, pay via M-Pesa Paybill{" "}
                <strong>5700700</strong>, and receive your airtime instantly.
              </p>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <p className="font-semibold">
                Q: What are the benefits of Mazeltov’s affordable data bundles?
              </p>
              <p className="mt-1">
                A: Mazeltov offers daily, weekly, and monthly bundles at
                competitive prices. Payments via Paybill{" "}
                <strong>5722222</strong> ensure fast and secure delivery to your
                line.
              </p>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <p className="font-semibold">
                Q: Can I send bulk SMS in Kenya with Mazeltov?
              </p>
              <p className="mt-1">
                A: Yes. Our <strong>bulk SMS services</strong> help businesses
                deliver OTPs, alerts, and marketing campaigns to customers
                instantly.
              </p>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <p className="font-semibold">
                Q: Does Mazeltov support buying voice minutes?
              </p>
              <p className="mt-1">
                A: Yes, you can purchase <strong>voice minute bundles</strong>{" "}
                for business or personal use directly from our platform.
              </p>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <p className="font-semibold">
                Q: Is Mazeltov safe for online payments?
              </p>
              <p className="mt-1">
                A: Absolutely. All payments are processed via secure M-Pesa
                Paybill numbers <strong>572 2222</strong> and{" "}
                <strong>5700 700</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-primary-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
          <p className="text-gray-700 mb-4">
            Buy airtime, data, SMS, or minutes instantly. For bulk requests or
            business needs, contact our team today.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md"
            >
              Contact us
            </Link>
            <Link
              href="/products"
              className="inline-block border border-blue-600 text-blue-600 px-5 py-2 rounded-md"
            >
              View Products
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
