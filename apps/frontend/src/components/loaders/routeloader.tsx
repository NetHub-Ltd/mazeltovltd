// components/RouteLoader.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

export function RouteLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/80 backdrop-blur-sm py-2">
      <Loader2 className="animate-spin text-blue-600" />
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  );
}
