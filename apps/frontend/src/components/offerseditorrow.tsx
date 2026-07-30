import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

import { bingwaSchema, BingwaOfferType } from "@/schemas";
import { Trash2Icon } from "lucide-react";

// Define the schema for validation based on your API data
const schema = bingwaSchema;

type OfferInput = BingwaOfferType;

export function OfferEditorRow({ offer }: { offer: OfferInput }) {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    reset, // Added reset to revert changes
  } = useForm<OfferInput>({
    resolver: zodResolver(schema),
    defaultValues: offer,
  });

  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [isDeleted, setIsDeleted] = useState(false);

  // Custom submit handler to include async saving and reset
  const onSubmit = async (data: OfferInput) => {
    toast.info("Saving offer...");
    try {
      const res = await fetch("/api/bingwa/update-offer", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to save offer. Please try again.", {
          duration: 5000,
        });
        throw new Error("Failed to save offer.");
      }

      toast.success("Offer has been saved.", { duration: 5000 });

      reset(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save offer:", error);
      toast.error("Failed to save offer. Please try again.", {
        duration: 5000,
      });
    }
  };

  const handleDelete = async () => {
    toast.info("Deleting offer...");
    const res = await fetch("/api/bingwa/remove-offer", {
      method: "POST",
      body: JSON.stringify({ id: offer.id }),
    });

    if (!res.ok) {
      toast.error("Failed to delete offer. Please try again.", {
        duration: 5000,
      });
      throw new Error("Failed to delete offer.");
    }

    toast.success("Offer has been deleted.", { duration: 5000 });
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null;
  }

  return (
    // Table row for display or edit
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
      {/* Display Mode */}
      {!isEditing && (
        <>
          <td className="px-4 py-3 text-sm font-semibold ">{offer.id}</td>
          <td className="px-4 py-3 text-sm  font-medium truncate">
            {offer.label}
          </td>
          <td className="px-4 py-3 text-sm  truncate">
            {offer.price.toFixed(2)}
          </td>
          <td className="px-4 py-3 text-sm  truncate">{offer.validity}</td>
          <td className="px-4 py-3 text-sm  truncate">{offer.category}</td>
          <td className="px-4 py-3 text-sm  truncate max-w-xs overflow-hidden text-ellipsis whitespace-nowrap hidden md:table-cell">
            {offer.description}
          </td>
          <td className="px-4 py-3 text-right flex flex-col sm:flex-row gap-2 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xs font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-slate-100 text-red-500 hover:text-white rounded-md hover:bg-red-400  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-xs font-medium"
            >
              {/* Delete */}
              {<Trash2Icon className="w-4 h-4 ml-1" />}
            </button>
          </td>
        </>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <>
          <td className="px-4 py-3 text-sm font-semibold text-gray-700">
            {offer.id}
          </td>
          <td className="px-4 py-3">
            <input
              {...register("label")}
              placeholder="Label"
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.label && (
              <p className="text-red-500 text-xs mt-1">
                {errors.label.message}
              </p>
            )}
          </td>
          <td className="px-4 py-3">
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="Price"
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </td>
          <td className="px-4 py-3">
            <input
              {...register("validity")}
              placeholder="Validity"
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.validity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.validity.message}
              </p>
            )}
          </td>
          <td className="px-4 py-3">
            <input
              {...register("category")}
              placeholder="Category"
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </td>
          <td className="px-4 py-3 hidden md:table-cell">
            <input
              {...register("description")}
              placeholder="Description"
              className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </td>
          <td className="px-4 py-3 text-right flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)} // Use onClick with handleSubmit here as it's not a direct form
              disabled={!isDirty || isSubmitting}
              className={`px-3 py-1 rounded-md text-white text-xs font-medium transition duration-150 ease-in-out
                ${
                  isDirty && !isSubmitting
                    ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                    : "bg-gray-400 cursor-not-allowed"
                }
                ${isSubmitting ? "opacity-75 cursor-wait" : ""}
              `}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset(offer); // Revert to original offer data
                setIsEditing(false); // Exit edit mode
              }}
              disabled={isSubmitting}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-xs font-medium"
            >
              Cancel
            </button>
          </td>
        </>
      )}
    </tr>
  );
}
