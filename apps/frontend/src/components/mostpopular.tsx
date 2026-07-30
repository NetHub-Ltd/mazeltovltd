"use client";
import axiosClient from "@/lib/axios";
import { useState, useEffect } from "react";
import { BingwaArraySchema, BingwaBundle } from "@/lib/schemas/schemas";

import Link from "next/link";
import { CheckCircle, Star } from "lucide-react";


export default function PopularBundles() {
  const [popularBundles, setPopularBundles] = useState<BingwaBundle[]>([]);

  useEffect(() => {
    const fetchPopularBundles = async () => {
      try {
        const response = await axiosClient.get("/bingwa/popular-offers");
        if (response.data.success) {
          const validated = BingwaArraySchema.safeParse(response.data.data);
          if (validated.success) {
            setPopularBundles(validated.data);
          } else {
            console.error("Validation errors found:", validated.error);
          }
        }
      } catch (error) {
        console.error("Error fetching popular bundles:", error);
      }
    };

    fetchPopularBundles();
  }, []);

  return (
    <section className=" py-20 p-4 border border-slate-200 rounded-md bg-surface">

      <div className="mx-auto w-full">
        <header className=" ">
          <h2 className="text-heading  md:text-center  font-bold">
            Top Choices for You
          </h2>
          <p className="text-sm  text-left md:text-center">
            Simple, transparent bundles that give you the best value — choose
            what suits your usage and get connected instantly.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularBundles.map((bundle) => (
            <article
              key={bundle.label}
              role="listitem"
              aria-label={`${bundle.label} — ${bundle.price}`}
              className={`relative rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden transform transition hover:shadow-xl hover:-translate-y-1 focus-within:shadow-xl`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${bundle.color} text-white`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    {bundle.label}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-white opacity-95">
                    Ksh {bundle.price}
                  </p>
                </div>

                {bundle.featured && (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="font-medium">Best Value</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <ul className="space-y-3" aria-hidden={false}>
                  {bundle.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-100 pt-4">
                  <Link
                    href={bundle.link}
                    aria-label={`Buy ${bundle.label}`}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition transform hover:scale-[1.01] bg-gradient-to-r ${bundle.color}`}
                  >
                    Buy Now
                  </Link>

                  <div className="mt-3 text-center text-xs text-slate-400">
                    Secure checkout • Instant activation
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
