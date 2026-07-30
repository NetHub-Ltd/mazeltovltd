"use client";
import { toast } from "sonner";
import axiosClient from "@/lib/axios";
import { useUser } from "@/hooks/userHook";

import { z } from "zod";
const ContactSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.email().optional(),
  address: z.string().optional(),
  phone_number: z.string().min(10, "Phone is required"),
  source: z.string().optional(),
  tag: z.string().optional(),
});

// export type Contact = z.infer<typeof ContactSchema>;
export const ArrayContactSchema = z.array(ContactSchema);

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

type Contact = {
  id?: number;
  name?: string;
  email?: string;
  address?: string;
  phone_number?: string;
  source?: string;
  tag?: string;
  created_at?: string;
  updated_at?: string;
};

const ContactForm = ({
  contact,
  // onSubmit,
  onCancel,
}: {
  contact: Contact | null;
  // onSubmit: (data: Contact) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Contact>(
    contact || { phone_number: "" }
  );
    const {  accessToken} = useUser();

  const onSubmit = async (data: Contact) => {
    console.log("Form data to be sent:", data);
    toast.success("Submitting contact!");
    console.log(JSON.stringify(data));
    try {
      const res = await axiosClient.post("/contacts/create-contact", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        toast.success("Contact added successfully!");
      } else {
        toast.error(res.data.client_message || "Failed to add contact.");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact. Please try again.");
    }
  };

  useEffect(() => {
    // Defer state update to prevent synchronous call within effect
    const timer = setTimeout(() => {
      setFormData(contact || { phone_number: "" });
    }, 0);
    return () => clearTimeout(timer);
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <h3 className="text-2xl font-semibold  mb-4">
        {contact ? "Edit Contact" : "Add New Contact"}
      </h3>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Contact Name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="phone_number"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., 0712345678"
        />
      </div>
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="123 Main St"
        />
      </div>
      <div>
        <label
          htmlFor="source"
          className="block text-sm font-medium text-gray-700"
        >
          Source
        </label>
        <input
          type="text"
          id="source"
          name="source"
          value={formData.source || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Web Form, Referral"
        />
      </div>
      <div>
        <label
          htmlFor="tag"
          className="block text-sm font-medium text-gray-700"
        >
          Tag
        </label>
        <input
          type="text"
          id="tag"
          name="tag"
          value={formData.tag || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., VIP, New Customer"
        />
      </div>
      <div className="flex justify-center space-x-3 mt-6">
        <Button
          type="button"
          onClick={onCancel}
          className=" bg-gray-300 text-slate-600 hover:bg-gray-400 transition-all duration-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          {contact ? "Save Changes" : "Add Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;