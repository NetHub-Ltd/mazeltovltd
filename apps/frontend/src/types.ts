export interface SEOPage {
  id: number;
  slug: string;
  title: string;
  description: string;
  keywords: string;
  og_image?: string;
  created_at: string;
  updated_at: string;
}

export interface BingwaOffer {
  id: number;
  category: string;
  label: string;
  price: number;
  validity: string;
}

