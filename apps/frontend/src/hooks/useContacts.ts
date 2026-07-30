'use client'
import { contactsArraySchema, Contact } from "@/schemas/analytics";

import useSWR from "swr";
import { useCallback } from "react";

const fetcher = async (url: string): Promise<Contact[]> => {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch contacts");
    const data = await res.json();
    console.log("Contacts API Response:", data);
  return contactsArraySchema.parse(data);
};

// export default fetcher;

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR<Contact[]>(
    "/api/contacts",
    fetcher,
    {
      dedupingInterval: 1000 * 60, // Avoid repeated calls inside 1 min
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  // Manual refresh if needed
  const refresh = useCallback(() => {
    mutate(); // refetch from server
  }, [mutate]);

  return {
    contacts: data,
    loading: isLoading,
    error,
    refresh,
  };
}


