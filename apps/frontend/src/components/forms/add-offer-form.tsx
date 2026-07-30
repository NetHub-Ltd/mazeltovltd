"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { bingwaSchema } from "@/schemas";

// Dropdown options
const categories = [
  { value: "data", label: "Data" },
  { value: "sms", label: "SMS" },
  { value: "minutes", label: "Minutes" },
  { value: "combo", label: "Combo" },
  // { value: "minutes_plus_data", label: "Minutes + Data" },
];

const tags = [
  { value: "loyalty", label: "Loyalty" },
  { value: "popular", label: "Popular" },
  { value: "offer", label: "Offer" },
];

// Zod schema for form (omit ID, validate dropdown)
const addOfferSchema = bingwaSchema
  .omit({ id: true })
  .refine((data) => !!data.category, {
    message: "Category is required",
    path: ["category"],
  })
  .refine((data) => !!data.tag, { message: "Tag is required", path: ["tag"] });

type AddOfferFormValues = z.infer<typeof addOfferSchema>;

interface AddOfferFormProps {
  onSave: (data: AddOfferFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function AddOfferForm({
  onSave,
  onCancel,
  isSaving,
}: AddOfferFormProps) {
  const form = useForm<AddOfferFormValues>({
    resolver: zodResolver(addOfferSchema),
    defaultValues: {
      label: "",
      price: 0,
      validity: "",
      category: "",
      description: "",
      tag: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: AddOfferFormValues) => {
    await onSave(data);
    reset();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {" "}
      {/* Fixed width */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-md shadow-md"
      >
        {/* LABEL */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Label</label>
          <Input
            placeholder="e.g., 100MB"
            {...register("label")}
            className="w-full"
          />
          {errors.label && (
            <p className="text-sm text-red-600">{errors.label.message}</p>
          )}
        </div>

        {/* PRICE */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Price</label>
          <Input
            type="number"
            placeholder="e.g., 100"
            {...register("price", { setValueAs: (v) => parseInt(v, 10) || 0 })}
            className="w-full"
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* VALIDITY */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Validity</label>
          <Input
            placeholder="e.g., 24 hours"
            {...register("validity")}
            className="w-full"
          />
          {errors.validity && (
            <p className="text-sm text-red-600">{errors.validity.message}</p>
          )}
        </div>

        {/* CATEGORY */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Category</label>
          <select
            {...register("category")}
            className="w-full border rounded p-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Description</label>
          <Textarea
            placeholder="e.g., 100MB for 24 hours"
            {...register("description")}
            className="w-full"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* TAG */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Tag</label>
          <select {...register("tag")} className="w-full border rounded p-2">
            <option value="">Select tag</option>
            {tags.map((tag) => (
              <option key={tag.value} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </select>
          {errors.tag && (
            <p className="text-sm text-red-600">{errors.tag.message}</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
