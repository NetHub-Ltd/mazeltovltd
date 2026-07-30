// hooks/use-user.ts
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useUser = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${window.location.pathname}`);
    }
  }, [status, router]);

  // Return the user and accessToken once the session is loaded
  if (status === "authenticated") {
    // You've already cast these types correctly in your auth.ts file,
    // so here we can confidently return the data.

    // console.log("useUser hook session:", session);
    return {
      user: session.user,
      accessToken: session.accessToken,
      status,
    };
  }

  // Handle loading and unauthenticated states
  return {
    user: undefined,
    accessToken: undefined,
    status,
  };
};
