// "use client";

// import React from "react";
// import Link from "next/link";

// import { FaFacebookF, FaInstagram } from "react-icons/fa";
// import { AiFillTikTok } from "react-icons/ai";
// import { IoLogoWhatsapp } from "react-icons/io";

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800">
//       <div className="max-w-7xl mx-auto px-6 py-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//           {/* Brand / Contact */}
//           <div>
//             <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">
//               Mazeltov LTD
//             </h3>
//             <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
//               Reliable Kenyan commercial services — quality, integrity and long
//               standing customer relationships.
//             </p>

//             <div className="mt-4 text-sm space-y-1 text-slate-600 dark:text-slate-300">
//               <a
//                 href="tel:+254784441637"
//                 className="block hover:text-blue-600 transition-colors duration-150"
//                 aria-label="Call Mazeltov"
//               >
//                 Phone: +254 791 178 111
//               </a>
//               <a
//                 href="mailto:info@mazeltov.co.ke"
//                 className="block hover:text-blue-600 transition-colors duration-150"
//                 aria-label="Email Mazeltov"
//               >
//                 Email: info@mazeltov.co.ke
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <nav aria-labelledby="footer-links">
//             <h4 id="footer-links" className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
//               Quick Links
//             </h4>
//             <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
//               <li>
//                 <Link className="hover:text-blue-600 transition-colors duration-150" href="/">Home</Link>
//               </li>
//               <li>
//                 <Link className="hover:text-blue-600 transition-colors duration-150" href="/services">Services</Link>
//               </li>
//               <li>
//                 <Link className="hover:text-blue-600 transition-colors duration-150" href="/about">About Us</Link>
//               </li>
//               <li>
//                 <Link className="hover:text-blue-600 transition-colors duration-150" href="/contact">Contact</Link>
//               </li>
//               <li>
//                 <Link className="hover:text-blue-600 transition-colors duration-150" href="/buy-airtime">Buy Airtime</Link>
//               </li>
//             </ul>
//           </nav>

//           {/* Products */}
//           <div>
//             <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">Our Products</h4>
//             <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
//               <li>
//                 <a className="hover:text-blue-600 transition-colors duration-150" href="#">Airtel 4G MiFi Devices</a>
//               </li>
//               <li>
//                 <Link className="hover:text-blue-600 transition-colors duration-150" href="/buy-airtime">Mobile Airtime Top-up</Link>
//               </li>
//               <li>
//                 <a className="hover:text-blue-600 transition-colors duration-150" href="#">Data Bundles</a>
//               </li>
//             </ul>
//           </div>

//           {/* Social / CTA */}
//           <div>
//             <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">Connect With Us</h4>
//             <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
//               Follow or message us on social media — quick replies on WhatsApp.
//             </p>

//             <div className="flex items-center gap-3">
//               <a
//                 href="https://web.facebook.com/mazeltov34"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Mazeltov on Facebook"
//                 className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
//               >
//                 <FaFacebookF className="text-lg" />
//               </a>

//               <a
//                 href="#"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Mazeltov on Instagram"
//                 className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-pink-500 hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
//               >
//                 <FaInstagram className="text-lg" />
//               </a>

//               <a
//                 href="https://www.tiktok.com/@mazeltov2024?"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Mazeltov on TikTok"
//                 className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-black hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
//               >
//                 <AiFillTikTok className="text-xl" />
//               </a>

//               <a
//                 href="https://wa.me/254784441637?text=Hello%20Mazeltov"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Chat with Mazeltov on WhatsApp"
//                 className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-green-500 hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
//               >
//                 <IoLogoWhatsapp className="text-xl" />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
//             <Link href="/legal/terms-conditions" className="hover:text-blue-600">Terms &amp; Conditions</Link>
//             <Link href="/legal/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
//           </div>

//           <div className="text-center md:text-left text-slate-600 dark:text-slate-300">
//             &copy; {new Date().getFullYear()} Mazeltov. All rights reserved.
//           </div>

//           {/* <div className="text-slate-400 text-xs hidden md:block">Version: 1.2.6</div> */}
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand / Contact */}
          <div>
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">
              Mazeltov LTD
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Instant Airtime, Data, SMS & Minutes top-up in Kenya. Fast,
              secure, and reliable.
            </p>

            <div className="mt-4 text-sm space-y-1 text-slate-600 dark:text-slate-300">
              <a
                href="tel:+254791178111"
                className="block hover:text-blue-600 transition-colors duration-150"
              >
                Phone: +254 791 178 111
              </a>
              <a
                href="mailto:info@mazeltov.co.ke"
                className="block hover:text-blue-600 transition-colors duration-150"
              >
                Email: info@mazeltov.co.ke
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-links">
            <h4
              id="footer-links"
              className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2"
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors duration-150"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors duration-150"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors duration-150"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-blue-600 transition-colors duration-150"
                >
                  Buy Airtime & Bundles
                </Link>
              </li>
            </ul>
          </nav>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Airtime Top-up</li>
              <li>Data Bundles</li>
              <li>SMS Bundles</li>
              <li>Minutes Packages</li>
            </ul>
          </div>

          {/* Social / CTA */}
          <div>
            <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
              Connect With Us
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              Quick replies on WhatsApp and updates on socials.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://web.facebook.com/mazeltov34"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mazeltov on Facebook"
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 hover:shadow-md transition"
              >
                <FaFacebookF className="text-lg" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mazeltov on Instagram"
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-pink-500 hover:shadow-md transition"
              >
                <FaInstagram className="text-lg" />
              </a>

              <a
                href="https://www.tiktok.com/@mazeltov2024?"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mazeltov on TikTok"
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-black hover:shadow-md transition"
              >
                <AiFillTikTok className="text-xl" />
              </a>

              <a
                href="https://wa.me/254784441637?text=Hello%20Mazeltov"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Mazeltov on WhatsApp"
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-green-500 hover:shadow-md transition"
              >
                <IoLogoWhatsapp className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="text-center md:text-left text-slate-600 dark:text-slate-300">
            &copy; {new Date().getFullYear()} Mazeltov LTD. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
