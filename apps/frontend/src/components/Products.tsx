"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { BingwaCard } from "./BingwaCard";
import Script from "next/script";
import { productsjsonLd } from "@/lib/website-structured_data";
import { useFetchBingwaOffers } from "@/hooks/usefetchbingwaoffers";

const TABS = [
  { key: "data", label: "Data" },
  { key: "sms", label: "SMS" },
  { key: "minutes", label: "Minutes" },
  { key: "minutesPlusData", label: "Minutes + Data" },
  { key: "combo", label: "Combo" },
];

const OfferCards = () => {
  const [activeSection, setActiveSection] = useState<string>(TABS[0].key);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  const { offers, loading, error } = useFetchBingwaOffers();

  // Group offers by category
  const offersByCategory = useMemo(() => {
    return TABS.reduce<Record<string, typeof offers>>((acc, tab) => {
      acc[tab.key] = offers.filter((o) => o.category === tab.key);
      return acc;
    }, {});
  }, [offers]);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionsRef.current[key];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll to section if URL has a hash on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && sectionsRef.current[hash]) {
        // Defer scroll until after the current render cycle to avoid cascading renders
        const timer = setTimeout(() => scrollToSection(hash), 0);
        return () => clearTimeout(timer); // Cleanup timer on unmount or re-run
      }
    }
  }, [offers]); // wait for offers to render

  return (
    <>
      <Script
        id="bingwa-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsjsonLd) }}
      />

      <div className="w-full md:p-4 min-h-screen flex flex-col items-center">
        {/* Header */}
        <div className="w-full p-4 mb-6 text-center rounded-lg">
          <h1 className="font-extrabold text-heading tracking-tight leading-tight">
            Bingwa Sokoni Offers
          </h1>
          <p className="text-text max-w-2xl mx-auto mt-2">
            Explore great deals across categories. Tap a category to jump down,
            or scroll — the category bar updates as you move.
          </p>

          {/* Mobile Dropdown */}
          <div className="mt-4 md:hidden">
            <label htmlFor="category-select" className="sr-only">
              Choose category
            </label>
            <select
              id="category-select"
              value={activeSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full p-3 border border-emerald-300 rounded-lg text-base text-emerald-800 bg-white"
            >
              {TABS.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label} ({offersByCategory[tab.key]?.length ?? 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex sticky top-4 z-40 max-w-7xl w-full bg-surface backdrop-blur-sm px-3 py-2 rounded-full shadow-sm items-center justify-center space-x-3 mb-6">
          {TABS.map((tab) => {
            const count = offersByCategory[tab.key]?.length ?? 0;
            const isActive = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => scrollToSection(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md transform scale-105"
                    : "bg-white text-emerald-800 border border-emerald-100 hover:bg-emerald-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? "bg-emerald-800/30"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Offers Content */}
        <div className="w-full space-y-12">
          {loading ? (
            <p className="text-center">Loading offers...</p>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            TABS.map((tab) => {
              const items = offersByCategory[tab.key] ?? [];
              return (
                <section
                  key={tab.key}
                  id={tab.key} // important for URL hash
                  data-section-key={tab.key}
                  ref={(el) => {
                    sectionsRef.current[tab.key] = el;
                  }}
                  className="scroll-mt-20"
                >
                  <h2 className="text-2xl font-bold mb-2">{tab.label}</h2>
                  {items.length === 0 ? (
                    <p>No offers for {tab.label} yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((offer) => (
                        <BingwaCard key={offer.id} {...offer} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default OfferCards;
