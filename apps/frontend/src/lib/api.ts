import { SEOPage } from "@/types";
import axiosClient from "./axios";

export const fetchSEOPages = async (): Promise<SEOPage[]> => {
  const res = await axiosClient.get<SEOPage[]>("/seo");
  return res.data;
};


// lib/api.ts
export type LoyaltyData = {
  points: number
  offers: { id: number; label: string; cost: number }[]
}

export async function fetchLoyalty(phoneNumber: string): Promise<LoyaltyData | null> {
  // Simulate API latency
  await new Promise((res) => setTimeout(res, 800))

  // Fake dataset
  const db: Record<string, LoyaltyData> = {
    "254700000001": {
      points: 120,
      offers: [
        { id: 1, label: "10% Discount Voucher", cost: 50 },
        { id: 2, label: "Free Delivery", cost: 70 },
      ],
    },
    "254700000002": {
      points: 40,
      offers: [{ id: 3, label: "5% Discount Voucher", cost: 30 }],
    },
  }

  return db[phoneNumber] ?? null
}
