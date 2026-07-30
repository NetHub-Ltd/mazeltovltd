"use client";

import { useEffect, useState, useCallback } from "react";
import axiosClient from "@/lib/axios";
import { useUser } from "@/hooks/userHook";
import { BingwaOfferType } from "@/schemas";

export function useOffers() {
  // --- state ---------------------------------------------------------
  const [offers, setOffers] = useState<BingwaOfferType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, status } = useUser();

  // --- fetch logic ----------------------------------------------------
  const fetchOffers = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/bingwa/get-all", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

        if (response.data?.success) {
          // console.log(response.data);
        setOffers(response.data.data);
      } else {
        setError(response.data?.client_message || "Failed to load offers");
      }
    } catch (err) {
      console.error("Error loading offers:", err);
      setError("Error fetching offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // --- auto-load when authenticated ----------------------------------
  useEffect(() => {
    if (status === "authenticated") {
      fetchOffers();
    }
  }, [status, fetchOffers]);

  // --- exposed API ----------------------------------------------------
  return {
    offers,
    loading,
    error,
    refetch: fetchOffers, // allows refreshing after updates
    setOffers, // optional: allows optimistic UI
  };
}
