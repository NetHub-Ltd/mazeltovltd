import z from "zod";

export const seoSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.string().min(1),
  og_image: z.string().url().optional().or(z.literal("")),
});

export const bingwaSchema = z.object({
  id: z.number().min(1),
  category: z.string().min(1),
  label: z.string().min(1),
  price: z.number().min(1),
  validity: z.string().min(1),
  description: z.string().min(1),
  tag: z.string().nullable(),
});

export const bingwaOffersArraySchema = z.array(bingwaSchema);
export type BingwaOfferType = z.infer<typeof bingwaSchema>;

export const contactsSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone_number: z.string(),
  source: z.string(),
  tag: z.string(),
  // created_at: z.date(),
});

export const contactArraySchema = z.array(contactsSchema);
export type Contact = z.infer<typeof contactsSchema>;

export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String), // normalize to string
  email: z.email(),
  name: z.string(),
  is_active: z.boolean(),
  super_user: z.boolean(),
});
export type AppUser = z.infer<typeof UserSchema>;
