"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { Analytics, Update, SaleItem, TrendItem } from "@/schemas/analytics";

// Types for the expected server response
export interface AnalyticsResponse {
  success: boolean;
  update: Update;
  sales: SaleItem[];
  trends: TrendItem[];
}

// Generic fetcher using fetch API
const fetcher = async (url: string) => {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

export function useAnalytics() {
  // SWR for auto caching, revalidation, refresh
  const { data, error, isLoading, mutate } = useSWR<Analytics>(
    "/api/analytics",
    fetcher,
    {
      dedupingInterval: 1000 * 60, // Avoid repeated calls inside 1 min
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  // Manual refresh if needed
  const refresh = useCallback(() => {
    mutate(); // refetch from server
  }, [mutate]);

  return {
    analytics: data,
    loading: isLoading,
    error,
    refresh,
  };
}
