// components/BingwaOfferCardList.tsx
"use client";
import { BingwaOfferType } from "@/schemas";

import BingwaCard from "./BingwaCard";

export function BingwaOfferCardList({
  offers,
}: {
  offers: BingwaOfferType[] | null;
}) {
  if (!offers)
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load offers. Please try again later.
      </div>
    );

  if (offers.length === 0)
    return (
      <div className="text-center py-8 text-gray-500">
        No offers available for this category.
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {offers.map((offer) => (
        <BingwaCard
          key={offer.id}
          label={offer.label}
          price={offer.price}
          validity={offer.validity}
          description={offer.description}
          category={offer.category}
          id={offer.id}
          tag={offer.tag}
        />
      ))}
    </div>
  );
}
