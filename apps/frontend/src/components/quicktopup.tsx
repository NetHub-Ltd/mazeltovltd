"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wifi, MessageSquareText, PhoneCall } from "lucide-react";
import axiosClient from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
// --- Validation schema ---
const topUpSchema = z.object({
  phone: z
    .string()
    .regex(/^(?:07|01)\d{8}$/, "Enter a valid Kenyan phone number"),
  amount: z
    .number({ error: "Amount is required" })
    .min(1, "Amount must be at least 1 Ksh"),
});

type TopUpFormValues = z.infer<typeof topUpSchema>;

export default function QuickTopUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TopUpFormValues>({
    resolver: zodResolver(topUpSchema),
  });

  const onSubmit = async (data: TopUpFormValues) => {
    try {
      const payload = {
        paying_number: data.phone,
        receiving_number: data.phone,
        amount: data.amount,
        };

        toast.success("Processing your request...", {
          description: "You will be notified once the payment is complete.",
        });

        const res = await axiosClient.post("/payments/airtime-stk-push", payload);
        console.log("STK Push Response:", res.data);

        // check axios status code
        if (res.status !== 200) {
            toast.error("Failed to initiate STK Push", {
                description: res.data.message || "An error occurred",
            });
            throw new Error(res.data.message || "Failed to initiate STK Push");
        }

        toast.success("STK Push initiated successfully", {
          description: "Confirmation will be sent to your phone.",
        });

    } catch (error: unknown) {
        if (error instanceof axios.AxiosError) {
            console.error("Submission Error:", error.message);
        } else if (error instanceof Error) {
            console.error("Validation Error:", error.message);
        }
        console.error("Submission Error:", error);
    }
  };

  return (
    <div className="order-first md:order-last">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100">
        <h3 className="text-lg font-semibold text-blue-800">Quick top-up</h3>
        <p className="mt-2 text-sm text-slate-600">
          Start a fast airtime purchase — no account required.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3">
          {/* Phone number */}
          <div className="flex flex-col gap-1">
            <input
              type="tel"
              inputMode="tel"
              aria-label="Phone number"
              placeholder="07XXXXXXXX"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-xs text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <input
              type="number"
              min={1}
              aria-label="Amount"
              placeholder="Amount (Ksh)"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <span className="text-xs text-red-500">
                {errors.amount.message}
              </span>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 inline-flex items-center w-1/2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Proceed to Pay"}
            </button>

            <Link href="/products/airtime" className="mt-1 inline-flex items-center justify-center w-1/2 px-4 py-3 rounded-lg border border-slate-200 bg-white text-blue-600 font-semibold shadow hover:bg-blue-200 transition disabled:opacity-50">Gift a friend</Link>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Secure payments via M-Pesa. Instant delivery to your phone.
          </p>
        </form>

        {/* Footer icons */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-green-500">
              <Wifi className="w-4 h-4" />
            </span>
            Network coverage
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">
              <MessageSquareText className="w-4 h-4" />
            </span>
            SMS & Data
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <PhoneCall className="w-4 h-4" />
            </span>
            24/7 support
          </div>
        </div>
      </div>
    </div>
  );
}
