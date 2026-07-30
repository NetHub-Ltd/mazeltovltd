import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { BingwaOfferType } from "@/schemas";

type OfferFormInputs = {
  payingNumber: string;
  receivingNumber: string;
};

/**

 * @component
 * @param {OfferCardProps} props - The properties for the BingwaCard component.
 * @param {string} props.label - The label or name of the offer.
 * @param {number} props.price - The price of the offer in Kenyan Shillings.
 * @param {string} props.validity - The validity period of the offer.
 * @param {string} props.offer_id - The unique identifier for the offer.
 *
 * @returns {JSX.Element} The rendered BingwaCard component.
 *
 * @example
 * <BingwaCard
 *   label="Bingwa 30 Days"
 *   price={500}
 *   validity="30 Days"
 *   offer_id="bingwa-30"
 * />
 */
export const BingwaCard: React.FC<BingwaOfferType> = ({
  label,
  price,
  validity,
  id,
  description,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormInputs>({
    mode: "onChange",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const backendUrl = process.env.API_BASE_URL;
  // console.log(`Backend URL: ${backendUrl}`);

  // const url = `${backendUrl}/bingwa/stk-push`;
  // console.log(`URL: ${url}`);

  const onSubmit = async (data: OfferFormInputs) => {
    const payload = {
      paying_number: data.payingNumber,
      receiving_number: data.receivingNumber,
      amount: price,
      offer_id: id,
    };

    try {
      const res = await fetch('/api/bingwa/stkpush', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(response => response.json());

      console.log(`Response data: ${JSON.stringify(res)}`);

      if (res.success) {
        setSuccessMessage(res.message || "Request was succesful");
        return;
      }

      if (!res.success) {
        setErrorMessage(res.message || "Something went wrong. Try again.");
        return;
      }
    } catch (error: unknown) {
      setErrorMessage(
        (error as Error).message || "An error occurred. Please try again later."
      );
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 5000);
  };

  return (
    <div className=" mx-auto bg-surface border border-blue-100 shadow-sm min-w-[300px]  rounded-sm p-2 md:p-4 flex flex-col gap-6 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl  font-bold text-blue-600">{label}</h3>
          <span className="text-xs bg-green-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
            {validity}
          </span>
        </div>
        <div className="flex items-end gap-1 mt-2">
          <span className="text-2xl md:text-4xl font-bold text-heading">Ksh {price}</span>
          <span className="text-base">.00</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        autoComplete="off"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm  font-medium">Paying Number</label>
          <input
            type="text"
            {...register("payingNumber", {
              required: "Paying number is required",
              pattern: {
                value: /^(07|01)\d{8}$/,
                message: "Enter a valid Safaricom number",
              },
            })}
            placeholder="e.g. 0712345678"
            className={`w-full px-3 py-2 rounded-lg border text-base transition focus:ring-2 focus:ring-green-200 outline-none ${
              errors.payingNumber
                ? "border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-green-400"
            }`}
          />
          {errors.payingNumber && (
            <span className="text-xs text-red-500">
              {errors.payingNumber.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm  font-medium">Receiving Number</label>
          <input
            type="text"
            {...register("receivingNumber", {
              required: "Receiving number is required",
              pattern: {
                value: /^(07|01)\d{8}$/,
                message: "Enter a valid Safaricom number",
              },
            })}
            placeholder="e.g. 0712345678"
            className={`w-full px-3 py-2 rounded-lg border text-base transition focus:ring-2 focus:ring-green-200 outline-none ${
              errors.receivingNumber
                ? "border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-green-400"
            }`}
          />
          {errors.receivingNumber && (
            <span className="text-xs text-red-500">
              {errors.receivingNumber.message}
            </span>
          )}
        </div>

        <Button
          // disabled={isSubmitting || !isValid}
          type="submit"
          className="w-full  mt-2 rounded-lg bg-primary text-white font-semibold text-base md:text-lg shadow hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Buy Now"}
        </Button>
        <p className="text-xs text-muted text-center">{description}</p>
      </form>

      {(successMessage || errorMessage) && (
        <div
          className={`w-full text-center py-2 rounded-lg text-sm font-medium transition ${
            successMessage
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}
    </div>
  );
};

export default BingwaCard;
