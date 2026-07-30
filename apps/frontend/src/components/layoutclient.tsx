"use client";

import { useEffect } from "react";
import { usePathname} from "next/navigation";
import { SessionProvider } from "next-auth/react"; // ✅ import
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "sonner";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Optional: customize NProgress appearance
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 });

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const router = useRouter();
  const hideLayout = pathname?.startsWith("/dashboard");

  useEffect(() => {
    // Show progress bar on route change
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <SessionProvider>
      <div className="flex  flex-col min-h-screen">
        {!hideLayout && (
          <header className="sticky h-20 top-0 z-50 bg-transparent">
            <Navbar />
          </header>
        )}
        <main className="flex-1 mb-4  mx-auto p-2">
          <Toaster richColors position="top-right" />
          {children}
        </main>
        {!hideLayout && <Footer />}
      </div>
    </SessionProvider>
  );
}
