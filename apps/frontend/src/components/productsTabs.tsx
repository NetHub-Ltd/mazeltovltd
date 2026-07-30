// components/ProductTabsClient.tsx
"use client";

import { Suspense, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ModernSpinner } from "@/components/Loaders"; // Your loader
import { BingwaOfferCardList } from "@/components/BingwaOfferCardList"; // Your list component
import { BingwaOfferType } from "@/schemas";


interface ProductTabsClientProps {
  currentSlug: string;
  descriptions: Record<string, { title: string; content: string }>;
  offers: BingwaOfferType[];
}

export function ProductTabsClient({
  currentSlug,
  descriptions,
  offers,
}: ProductTabsClientProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Description card */}
      <div className="bg-surface rounded-lg p-2 mb-6 shadow-sm border border-slate-100 ">
        <h1 className=" font-semibold text-heading mb-2 capitalize">
          {descriptions[currentSlug].title}
        </h1>
        <p className="text-sm sm:text-base text-paragraph leading-relaxed">
          {descriptions[currentSlug].content}
        </p>
      </div>

      {/* Tabs (sticky) */}
      <div
        ref={tabsRef}
        // keep sticky with a safe top offset; backdrop blur for a modern look
        className="sticky  top-[calc(4rem+env(safe-area-inset-top))] z-20 mt-12"
        style={{ WebkitBackdropFilter: "saturate(180%) blur(6px)" }}
      >
        <nav
          role="navigation"
          aria-label="Product categories"
          className="bg-white/75 backdrop-blur-sm border border-slate-100 rounded-lg shadow-sm p-3"
        >
          <div className="flex items-center">
            <div className="overflow-x-auto w-full scrollbar-hidden">
              <div className="flex gap-3 items-center whitespace-nowrap px-1">
                {Object.entries(descriptions).map(([key, value]) => {
                  const isActive = key === currentSlug;
                  return (
                    <Link
                      key={key}
                      href={`/products/${key}`}
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "inline-flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-150",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400",
                        {
                          "bg-blue-600 text-white shadow-md transform hover:scale-[1.03]":
                            isActive,
                          "text-slate-700 bg-transparent hover:bg-slate-100":
                            !isActive,
                        }
                      )}
                    >
                      <span className="block max-w-[10rem] truncate">
                        {value.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="mt-6 ">
        <Suspense fallback={<ModernSpinner />}>
          <BingwaOfferCardList offers={offers} />
        </Suspense>
      </div>
    </div>
  );
}
