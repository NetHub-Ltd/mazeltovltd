"use client";

import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Phone, CreditCard, Info } from "lucide-react";

const phoneRegex = /^[0-9]{10}$/; // Kenyan 10-digit format e.g. 0712345678


const FormSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  receiving_number: z
    .string()
    .regex(phoneRegex, "Enter a valid 10-digit number"),
  paying_number: z.string().regex(phoneRegex, "Enter a valid 10-digit number"),
});


type FormValues = z.infer<typeof FormSchema>;

export default function KyandaAirtimeForm() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting},
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
      receiving_number: "",
      paying_number: "",
    } satisfies FormValues, // 👈 avoids widening to FieldValues
    mode: "onTouched",
  });


  // sanitize phone: remove non-digits and ensure 10 digits (if user added country code)
  const sanitizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("254")) {
      return "0" + digits.slice(3);
    }
    if (digits.length === 11 && digits.startsWith("0")) {
      // maybe user typed an extra 0, trim to last 10
      return digits.slice(digits.length - 10);
    }
    return digits;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setServerError(null);
    setSuccessMessage(null);
    setLoading(true);

    const payload = {
      paying_number: sanitizePhone(data.paying_number),
      receiving_number: sanitizePhone(data.receiving_number),
      amount: data.amount,
    };

    try {
      const res = await fetch("/api/airtime-stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSuccessMessage(
        data?.message ?? "Airtime request submitted. Check your phone to complete payment."
      );

      reset();
      // auto-clear success after a short time
    } catch (err: unknown) {
      console.error(err);
      const defaultMsg = "Something went wrong. Please try again.";
      if (axios.isAxiosError(err)) {
        // axios error — prefer server-provided message, fall back to axios message
        setServerError(err.response?.data?.message ?? err.message ?? defaultMsg);
      } else if (err instanceof Error) {
        // generic Error instance
        setServerError(err.message);
      } else {
        // unknown non-Error value
        setServerError(defaultMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-[400px]">
      <div className="bg-gray-50 shadow-md border border-slate-200 p-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-semibold ">Airtime Top-up</h2>
          <p className="text-sm mt-1">
            {"Instantly top-up your line or someone else's. Payment will be prompted on your phone."}
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
          <Info size={18} className="mt-0.5" />
          <div>
            <div className="font-medium">Auto network detection</div>
            <div className="text-xs text-blue-700/90">
              We’ll automatically detect the network when you enter the number.
            </div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount (KES)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              Ksh
            </span>
            <Input
              id="amount"
              type="number"
              step="1"
              min={1}
              placeholder="100"
              {...register("amount", { valueAsNumber: true })}
              aria-invalid={errors.amount ? "true" : "false"}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              className={`pl-12 pr-3 py-2 ${
                errors.amount
                  ? "border-red-500"
                  : "focus:border-blue-500 focus:ring-blue-200 border-slate-300"
              }`}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-sm text-red-600">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Receiving Number */}
        <div>
          <label
            htmlFor="receiving_number"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Receiving Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={16} />
            </span>
            <Input
              id="receiving_number"
              type="tel"
              inputMode="tel"
              placeholder="0712345678"
              {...register("receiving_number")}
              aria-invalid={errors.receiving_number ? "true" : "false"}
              aria-describedby={
                errors.receiving_number ? "receiving-error" : "receiving-help"
              }
              className={`pl-10 pr-3 py-2 ${
                errors.receiving_number
                  ? "border-red-500"
                  : "focus:border-blue-500 focus:ring-blue-200   border-slate-300"
              }`}
              maxLength={12}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            {errors.receiving_number ? (
              <p id="receiving-error" className="text-sm text-red-600">
                {errors.receiving_number.message}
              </p>
            ) : (
              <p id="receiving-help" className="text-xs text-gray-500">
                Enter 10 digits e.g. 0712345678.
              </p>
            )}
          </div>
        </div>

        {/* Paying Number */}
        <div>
          <label
            htmlFor="paying_number"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Paying Number (will receive payment prompt)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={16} />
            </span>
            <Input
              id="paying_number"
              type="tel"
              inputMode="tel"
              placeholder="0712345678"
              {...register("paying_number")}
              aria-invalid={errors.paying_number ? "true" : "false"}
              aria-describedby={
                errors.paying_number ? "paying-error" : "paying-help"
              }
              className={`pl-10 pr-3 py-2 ${
                errors.paying_number
                  ? "border-red-500"
                  : "focus:border-blue-500 focus:ring-blue-200 border-slate-300"
              }`}
              maxLength={12}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            {errors.paying_number ? (
              <p id="paying-error" className="text-sm text-red-600">
                {errors.paying_number.message}
              </p>
            ) : (
              <p id="paying-help" className="text-xs text-gray-500">
                This number will receive the STK push for payment.
              </p>
            )}
          </div>
        </div>

        {/* Server error / Success */}
        <div aria-live="polite" className="min-h-[1.25rem]">
          {serverError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-2">
              {serverError}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-green-800 bg-green-50 border border-green-100 rounded-md p-2">
              {successMessage}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2"
          aria-live="assertive"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {loading ? "Submitting..." : "Buy Airtime Now"}
        </Button>
      </div>
    </form>
  );
}
