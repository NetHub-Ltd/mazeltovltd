"use client";
import Link from "next/link";
import LandingPageSections from "@/components/hero-body";
import QuickTopUpForm from "@/components/quicktopup";
import Script from "next/script";
import { homepagejsonLd } from "@/lib/website-structured_data";

const HomePage = () => {
  return (
    <>
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepagejsonLd) }}
      />

      <main className="min-h-screen flex flex-col gap-8">
        <section
          id="hero-section"
          className="w-full"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto p-4 grid gap-10 md:grid-cols-2 items-center">
            {/* Left: messaging + CTAs */}

            <section id="hero">
              <div className="text-left">
                <h1
                  id="hero-heading"
                  className="mb-2 leading-tight text-heading"
                >
                  Get Airtime, Data, SMS, and Minutes Instantly.
                </h1>

                <p className="mt-5 ">
                  We deliver
                  <span className="text-primary font-bold px-2">
                    airtime across all Kenyan networks
                  </span>
                  and offer exclusive
                  <span className="px-2 font-bold">
                    Safaricom Data, SMS, and Minutes
                  </span>
                  ,Fast, secure, and reliable.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4">
                  {/* Primary CTA */}
                  <Link
                    href="/products/airtime"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition text-lg"
                    aria-label="Buy Airtime Now"
                  >
                    Buy Airtime Now
                  </Link>

                  {/* Secondary CTAs */}
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <Link
                      href="/products#data"
                      className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
                    >
                      Buy Data
                    </Link>
                    <Link
                      href="/products#sms"
                      className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
                    >
                      Buy SMS
                    </Link>
                    <Link
                      href="/products#minutes"
                      className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
                    >
                      Buy Minutes
                    </Link>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm ">
                  <span className="inline-block text-sm rounded-full bg-green-50 text-green-700 font-medium">
                    10k+ users
                  </span>
                  <span>•</span>
                  <span className="text-xs">
                    Rated highly for speed & reliability
                  </span>
                </div>
              </div>
            </section>

            {/* Right: conversion card (compact, focused CTA) */}
            <div className="hidden">
              <QuickTopUpForm />
            </div>
          </div>
        </section>

        {/* <PopularBundles /> */}

        <LandingPageSections />
      </main>
    </>
  );
};

export default HomePage;
