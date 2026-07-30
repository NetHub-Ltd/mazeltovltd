// src/schemas/analytics.ts
import { z } from "zod";

/**
 * Zod schema that matches the sample analytics payload you provided.
 * Keep this strict so any backend shape drift surfaces immediately.
 */


// {
//       id: '51e4b9d5b01d400f9b39365caa35c0b2',
//       mpesa_receipt_number: null,
//       paying_number: '254728404490',
//       receiving_number: '254728404490',
//       amount: 20,
//       status: 'failed',
//       transaction_date: '2025-09-06T11:26:58.863627'
//     },


export const transactionsSchema = z.object({
  id: z.string(),
  mpesa_receipt_number: z.string().nullable(),
  paying_number: z.string(),
  receiving_number: z.string(),
  amount: z.number().nonnegative(),
  status: z.string(),
  transaction_date: z.string(),
});

export const updateSchema = z.object({
  total_sales: z.number().int().nonnegative(),
  total_amount: z.number().nonnegative(),
});

export const saleItemSchema = z.object({
  label: z.string(),
  total_sales: z.number().int().nonnegative(),
});

export const trendItemSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  transactions: z.number().int().nonnegative(),
  total_amount: z.number().nonnegative(),
});

export const analyticsSchema = z.object({
  success: z.boolean(),
  update: updateSchema,
  sales: z.array(saleItemSchema),
  trends: z.array(trendItemSchema),
  // transactions: z.array(transactionsSchema),
});

// export const transactionArraySchema = z.array(transactionsSchema);


// contacts object from FastAPI response
// {
//       "name": null,
//       "email": null,
//       "address": null,
//       "phone_number": "254728404490",
//       "source": "Stk Push",
//       "tag": "Airtime Purchase",
//       "updated_at": "2025-09-02T16:57:57.905700+03:00",
//       "id": 1,
//       "created_at": "2025-09-02T16:57:59.772719+03:00"
//     },


export const contactsSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  phone_number: z.string(),
  source: z.string(),
  tag: z.string(),
  updated_at: z.string(),
  id: z.number(),
  created_at: z.string(),
});
export const contactsArraySchema = z.array(contactsSchema);
export type Contact = z.infer<typeof contactsSchema>;

export type Analytics = z.infer<typeof analyticsSchema>;

export type Update = z.infer<typeof updateSchema>;
export type SaleItem = z.infer<typeof saleItemSchema>;
export type TrendItem = z.infer<typeof trendItemSchema>;
