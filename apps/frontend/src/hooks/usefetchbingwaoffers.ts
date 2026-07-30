import { useEffect, useState, useCallback, useRef } from "react";
import { BingwaOfferType } from "@/schemas";

export function useFetchBingwaOffers(initialCategory?: string) {
  const [offers, setOffers] = useState<BingwaOfferType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cache: category -> offers
  const cache = useRef<Map<string, BingwaOfferType[]>>(new Map());

  const fetchOffers = useCallback(async (category?: string) => {
    const key = category || "__all__";

    // Return cached result if exists
    if (cache.current.has(key)) {
      setOffers(cache.current.get(key)!);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = category
        ? `?category=${encodeURIComponent(category)}`
        : "";
      const res = await fetch(`/api/bingwa/get-offers${params}`);
      const data: BingwaOfferType[] = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch offers");
      }

      if (data.length === 0) {
        throw new Error("No offers returned");
      }

      // Update state and cache
      setOffers(data);
      cache.current.set(key, data);
    } catch (err) {
      console.error("Error loading offers:", err);
      setError("Error fetching offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchOffers(initialCategory);
  }, [fetchOffers, initialCategory]);

  return { offers, loading, error, refetch: fetchOffers };
}
