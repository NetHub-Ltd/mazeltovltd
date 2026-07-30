// lib/validators/seo.ts
import { z } from "zod";

export const seoSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.string().min(1),
  og_image: z.string().url().optional().or(z.literal("")),
});

export type SEOFormData = z.infer<typeof seoSchema>;



export const userProfileSchema = z.object({
  id: z.number(), // or z.string() if your API returns UUIDs
  external_id: z.string(),
  full_name: z.string().min(3, "Full name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  float_rate: z.number().min(1, "Must be at least 1"),
  role: z.enum(["Admin", "Client"]),
  is_active: z.boolean(),
  alert_threshold: z.number().nullable(),
  float_balance: z.number(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const BingwaBundleSchema = z
  .object({
    id: z.number(),
    label: z.string().min(2).max(100),
    price: z.number().min(1),
    validity: z.string().min(1),
    category: z.enum(["data", "sms", "minutes", "combo", "minutesPlusData"]),
    description: z.string().min(1),
    tag: z.string().nullable(),
  })
  .transform((bundle) => {
    const presets = {
      data: {
        features: ["1.25GB High Speed Data", "Affordable Package"],
        color: "from-blue-500 to-blue-600",
        link: "/products/data",
      },
      sms: {
        features: ["1000 SMS Daily", "Cross-network Messaging"],
        color: "from-green-500 to-green-600",
        link: "/products/sms",
      },
      minutes: {
        features: ["Unlimited Talk Time", "Best Voice Value"],
        color: "from-yellow-500 to-orange-600",
        link: "/products/minutes",
      },
      combo: {
        features: ["Talk + Data Bundle", "Balanced Value"],
        color: "from-purple-500 to-pink-600",
        link: "/products/combo",
      },
      minutesPlusData: {
        features: ["Talk + Data Bundle", "Balanced Value"],
        color: "from-indigo-500 to-indigo-700",
        link: "/products/minutes-plus-data",
      },
    } as const;

    const { features, color, link } = presets[bundle.category];

    return {
      ...bundle,
      price: Number(bundle.price),
      features,
      color,
      link,
      featured: true,
    };
  });

// Array schema for bulk validation + enrichment
export const BingwaArraySchema = z.array(BingwaBundleSchema);

// Types
export type BingwaBundle = z.infer<typeof BingwaBundleSchema>;
export type BingwaArray = z.infer<typeof BingwaArraySchema>;
