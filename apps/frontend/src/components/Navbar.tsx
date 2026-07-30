"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Zap, Menu, X, Rocket, Info, MessageCircle } from "lucide-react";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", icon: Zap, description: "Go to homepage" },
    {
      label: "Products",
      href: "/products",
      icon: Rocket,
      description: "Browse our products",
    },
    {
      label: "About Us",
      href: "/about",
      icon: Info,
      description: "Learn more about us",
    },
    {
      label: "Help Center",
      href: "/contact",
      icon: MessageCircle,
      description: "Get support",
    },
  ];

  const quickLinks = [
    {
      label: "Buy SMS",
      href: "/products/sms",
      icon: Info,
      description: "Purchase SMS bundles",
    },
    {
      label: "Buy Minutes",
      href: "/products/minutes",
      icon: Info,
      description: "Purchase minutes bundles",
    },
    {
      label: "Buy Data",
      href: "/products/data",
      icon: Info,
      description: "Purchase data bundles",
    },
    {
      label: "Check Points",
      href: "/loyalty",
      icon: Info,
      description: "Check and redeem points",
    },
  ];

  // 🔒 Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface shadow-sm h-20">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-18 h-18">
            <Image src="/logo.png" alt="Mazeltov Logo" width={64} height={64} />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <h1 className="text-xl md:text-2xl font-bold">Mazeltov</h1>
            {/* <p className="text-xs md:text-sm ">Smart airtime & bundles</p> */}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <nav className="flex items-center gap-7 lg:gap-10">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative group py-2 font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {label}
                  <span
                    className={`block absolute bottom-0 left-0 h-[2px] bg-blue-600 w-full transform origin-left transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-75"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/products/airtime"
            className="inline-flex items-center px-4 py-2 rounded-lg shadow bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Buy Airtime Now
            <Rocket className="ml-2 w-4 h-4 hidden md:block" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Mazeltov</h2>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickLinks.map(({ label, href, icon: Icon, description }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-start gap-4 px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${
                          isActive
                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-base font-medium">{label}</span>
                        <span className="text-sm text-gray-500">
                          {description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* General Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Menu
              </h3>
              <div className="space-y-3">
                {navLinks.map(({ label, href, icon: Icon, description }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-start gap-4 px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${
                          isActive
                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-base font-medium">{label}</span>
                        <span className="text-sm text-gray-500">
                          {description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
