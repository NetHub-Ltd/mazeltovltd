// src/components/SeoProvider.tsx
"use client";

import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config"; // adjust path if needed

export default function SeoProvider() {
  return <DefaultSeo {...SEO} />;
}
