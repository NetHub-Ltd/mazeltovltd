"use client";

import { useForm } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaTrophy, FaRedo, FaCheckCircle, FaSpinner } from "react-icons/fa"; // Added FaSpinner
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "sonner";
import axiosClient from "@/lib/axios"; // Assuming this path is correct for your project
import { BingwaOfferType } from "@/schemas";

type FormValues = { phone: string };

export default function LoyaltyPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>();

  const [phone, setPhone] = useState<string>("");
  const [points, setPoints] = useState<number | null>(null);
  const [offers, setOffers] = useState<BingwaOfferType[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true); // New loading state for offers
  const [errorOffers, setErrorOffers] = useState<string | null>(null); // New error state for offers

  // useEffect to fetch loyalty offers on mount
  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoadingOffers(true); // Start loading
      setErrorOffers(null); // Clear any previous errors
      try {
        // const res = await axiosClient.get("/bingwa/loyalty-offers");
        // use fetch to get the offers
        const res = await fetch("/api/bingwa/loyalty");

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        if (data) {
          setOffers(data || []); // Ensure it's always an array
          toast.success("Loyalty offers fetched successfully.");
        } else {
          // Assuming an API might return success: false with an error message
          const errorMessage = "Failed to fetch loyalty offers.";
          toast.error(errorMessage);
          setErrorOffers(errorMessage);
          setOffers([]); // Ensure offers is empty on error
        }
      } catch (error) {
        console.error("Error fetching loyalty offers:", error);
        toast.error("Network error: Could not fetch loyalty offers.");
        setErrorOffers(
          "Could not load offers. Please check your internet connection."
        );
        setOffers([]); // Ensure offers is empty on error
      } finally {
        setIsLoadingOffers(false); // End loading
      }
    };
    fetchOffers();
  }, []); // Empty dependency array means this runs once on mount

  const onSubmit = async (data: FormValues) => {
    const phoneWithCountryCode = `254${data.phone.slice(1)}`;
    setPhone(phoneWithCountryCode);
    // Simulate backend call for points
    // const res = await axiosClient.get(`${process.env.API_BASE_URL}/loyalty/points`, {
    //   params: { phone: phoneWithCountryCode },
    // });

    const res = await fetch(
      `/api/bingwa/loyalty/points?phone=${phoneWithCountryCode}`
    );

    if (!res.ok) {
      toast.error("Failed to fetch points. Please try again.");
      return;
    }

    const result = await res.json();

    if (!result.success) {
      toast.error("Failed to fetch points. Please try again.");
      return;
    }

    const pointsData = result.data;

    if (pointsData && pointsData.length > 0) {
      console.log("Points API Response:", pointsData[0].total_points);
      setPoints(pointsData[0].total_points);
      toast.success(
        `Congratulations! You have ${pointsData[0].total_points} points.`
      );
    }
  };

  const handleRedeem = async (offer: BingwaOfferType) => {
    const payload = {
      id: offer.id,
      points: offer.price,
    };
    if (!phone) {
      toast.error("Please enter your phone number first to redeem.");
      return;
    }
    if (points === null || points < offer.price) {
      toast.error("You don't have enough points for this offer.");
      return;
    }

    const res = await axiosClient.post("/loyalty/redeem-points", payload);
    if (!res.data.success) {
      toast.error("Failed to redeem points. Please try again.");
      return;
    }

    toast.success(
      `Redeemed ${offer.label}! A confirmation has been sent to your phone.`
    );
    setPoints((prevPoints) =>
      prevPoints !== null ? prevPoints - offer.price : null
    );
  };

  const handleReset = () => {
    setPhone("");
    setPoints(null);
    reset(); // Resets the form fields
  };

  const isPointsChecked = points !== null;

  // Ensure we do not mutate the source data when sorting
  const sortedOffers = useMemo(() => {
    // Return empty array if offers are not yet loaded or empty
    if (!offers || offers.length === 0) return [];

    return [...offers].sort((a, b) => {
      const canRedeemA = points !== null && points >= a.price;
      const canRedeemB = points !== null && points >= b.price;
      if (canRedeemA && !canRedeemB) return -1; // Eligible offers first
      if (!canRedeemA && canRedeemB) return 1;
      return a.price - b.price; // Then sort by price
    });
  }, [points, offers]); // Recalculate if points or offers change

  // Safely calculate highestCost, defaulting to a reasonable value if offers is empty
  const highestCost =
    offers.length > 0 ? Math.max(...offers.map((b) => b.price)) : 1000;
  const progressPercent =
    points !== null
      ? Math.min(100, Math.round((points / highestCost) * 100))
      : 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col p-2">
      <header className="">
        <div className="bg-surface mx-auto mt-2 mb-4 p-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* logo */}
            <div className="hidden md:flex rounded-full bg-gradient-to-tr from-blue-600 to-primary p-3 text-white shadow-lg">
              <FaTrophy className="w-6 h-6" />
            </div>

            <div className="space-y-1 p-4">
              <h1 className=" font-extrabold text-text">
                Bingwa Loyalty Rewards
              </h1>
              <p className="text-sm text-gray-600">
                We reward you with points for every transaction and you can
                redeem them for exciting rewards.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-600">Need help?</span>
            <Link
              href="/contact"
              className="text-sm bg-white border border-purple-200 text-purple-700 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Input / points overview */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-4  border border-slate-200">
              {!isPointsChecked ? (
                <div className="space-y-4">
                  <h2 className="font-semibold text-text">Check Your Points</h2>
                  <p className="text-sm text-muted">
                    Enter your phone number to view available points and
                    redeemable items.
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <label
                      htmlFor="phone-input"
                      className="block text-sm text-gray-600"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      {...register("phone", { required: true })}
                      placeholder="e.g., +254 712 345678"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 transition text-base"
                      aria-label="phone"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-600 transition disabled:opacity-60"
                    >
                      {isSubmitting ? "Checking..." : "Check My Points"}
                    </button>
                  </form>
                  <p className="text-xs text-gray-400">
                    Your phone is used only to fetch loyalty points. No charges
                    applied.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Account</p>
                      <h3 className="text-xl font-bold text-gray-900">
                        {phone}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Points</p>
                      <div className="inline-flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-yellow-300 to-yellow-400 text-purple-900 px-3 py-2 rounded-xl font-extrabold text-lg shadow-sm">
                          {points}
                        </div>
                        <button
                          onClick={handleReset}
                          title="Reset to check another phone number"
                          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                        >
                          <FaRedo className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Progress to top reward
                    </p>
                    <div className="w-full bg-gray-100 rounded-xl h-3 overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-purple-600 to-indigo-500 transition-all"
                        style={{ width: `${progressPercent}%` }}
                        aria-hidden
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{points} pts</span>
                      <span>{highestCost} pts</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500">
                      Showing rewards for:{" "}
                      <span className="text-gray-700 font-medium">{phone}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 hidden lg:block">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800">Tips</h4>
                <ul className="text-sm text-gray-500 mt-2 space-y-2">
                  <li>- Earn points on every purchase.</li>
                  <li>- Points reset annually, so redeem often.</li>
                  <li>- Some bundles are limited-time offers.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right panel: Offers */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Available Bundles
              </h2>
              <p>
                we found <span className="font-bold">{offers.length}</span>{" "}
                offers for you.
              </p>

              {isLoadingOffers ? (
                <div className="flex justify-center items-center h-48 flex-col text-gray-500">
                  <FaSpinner className="animate-spin text-4xl mb-4" />
                  <p>Fetching loyalty offers...</p>
                </div>
              ) : errorOffers ? (
                <div className="flex justify-center items-center h-48 flex-col text-gray-500">
                  <p className="text-lg text-red-500 font-medium">
                    {errorOffers}
                  </p>
                  <button
                    onClick={async () => {
                      setIsLoadingOffers(true); // Re-trigger loading state
                      setErrorOffers(null); // Clear error
                      // You might want to re-run the fetchOffers function here
                      // For simplicity, re-triggering the useEffect logic:
                      const fetchOffers = async () => {
                        setIsLoadingOffers(true);
                        setErrorOffers(null);
                        try {
                          const res = await axiosClient.get(
                            "/bingwa/loyalty-offers"
                          );
                          if (res.data && res.data.success) {
                            setOffers(res.data.offers || []);
                            toast.success(
                              "Loyalty offers fetched successfully."
                            );
                          } else {
                            const errorMessage =
                              res.data?.message ||
                              "Failed to fetch loyalty offers.";
                            toast.error(errorMessage);
                            setErrorOffers(errorMessage);
                            setOffers([]);
                          }
                        } catch (error) {
                          console.error(
                            "Error fetching loyalty offers:",
                            error
                          );
                          toast.error(
                            "Network error: Could not fetch loyalty offers."
                          );
                          setErrorOffers(
                            "Could not load offers. Please check your internet connection."
                          );
                          setOffers([]);
                        } finally {
                          setIsLoadingOffers(false);
                        }
                      };
                      fetchOffers();
                    }}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : offers.length === 0 ? (
                <div className="flex justify-center items-center h-48 flex-col text-gray-500">
                  <p className="text-lg font-medium">
                    No loyalty offers available at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sortedOffers.map((offer) => {
                    const canRedeem = points !== null && points >= offer.price;
                    const insufficient =
                      points !== null && points < offer.price;

                    // Dynamically generate features based on the category
                    const features =
                      offer.category === "data"
                        ? [
                            `${
                              offer.label.split("GB")[0].split("MB")[0]
                            } High-Speed Data`,
                            offer.validity || "Valid for 24 hours",
                          ]
                        : offer.category === "minutes"
                        ? [
                            `${offer.label.split(" ")[0]} On-net Minutes`,
                            offer.validity || "Valid for 30 days",
                          ]
                        : offer.category === "sms"
                        ? [
                            `${offer.label.split(" ")[0]} Free SMS`,
                            offer.validity || "Valid for 24 hours",
                          ]
                        : [
                            offer.description || "General Loyalty Reward",
                            offer.validity || "Check offer details",
                          ];

                    return (
                      <div
                        key={offer.id}
                        className={`relative rounded-2xl p-6 flex flex-col transition-transform duration-300 border ${
                          canRedeem
                            ? "border-purple-50 shadow-lg"
                            : "border-gray-100 shadow-sm"
                        } bg-gradient-to-b from-white to-gray-50`}
                        aria-live="polite"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-extrabold text-gray-800">
                              {offer.label}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {offer.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Cost</p>
                            <div className="mt-1 inline-flex items-center gap-2">
                              <div className="text-sm font-bold text-purple-600">
                                {offer.price} pts
                              </div>
                              {canRedeem && (
                                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  Eligible
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <ul className="text-sm space-y-1 mt-4 text-gray-600">
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <FaCheckCircle className="text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 flex items-center gap-4">
                          <button
                            onClick={() => handleRedeem(offer)}
                            disabled={!canRedeem}
                            aria-label={`Redeem ${offer.label} for ${offer.price} points`}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm ${
                              canRedeem
                                ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-purple-900 hover:scale-105 shadow"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {insufficient
                              ? `Need ${offer.price - (points ?? 0)} More Pts`
                              : "Redeem Now"}
                          </button>

                          <div className="text-xs text-gray-500 px-3 py-2 rounded-lg bg-gray-50">
                            {offer.validity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/products"
            className="text-purple-600 hover:underline font-medium flex items-center gap-2"
          >
            <IoIosArrowBack />
            Back to Products
          </Link>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Bingwa
          </div>
        </div>
      </footer>
    </div>
  );
}
