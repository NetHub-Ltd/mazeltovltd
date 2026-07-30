import React from "react";
import {
  MessageSquareText,
  Wifi,
  PhoneCall,
  CheckCircle,
  Smartphone,
  DollarSign,
  Star,
  Award,
} from "lucide-react"; // Added Award icon for loyalty
import Link from "next/link";

// Assuming Button component is not defined, using <a> for CTAs
const LandingPageSections: React.FC = () => {
  return (
    <>
      {/* What We Offer Section */}
      <section
        id="features"
        className="py-12 md:py-20 bg-surface rounded-md border border-slate-200 text-center font-inter"
      >
        <h2 className="font-bold">What We Offer</h2>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-2 md:p-4 max-w-7xl mx-auto">
          {[
            {
              icon: (
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              ),
              title: "Instant Airtime Top-up",
              desc: "Quickly recharge your mobile with airtime across all Kenyan networks. Instant delivery guaranteed!",
              href: "/products/airtime",
              buttonText: "Top Up Airtime",
              bgColor: "bg-blue-50",
              btnColor: "bg-blue-600",
            },
            {
              icon: <Wifi className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />,
              title: "Bingwa Data Bundles",
              desc: "Get affordable Bingwa data bundles for all your internet needs. Stay connected, always.",
              href: "/products#data",
              buttonText: "Buy Data",
              bgColor: "bg-green-50",
              btnColor: "bg-green-600",
            },
            {
              icon: (
                <PhoneCall className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              ),
              title: "Bingwa Minutes",
              desc: "Affordable Bingwa minutes bundles for endless calls to any network. Talk more, pay less.",
              href: "/products#minutes",
              buttonText: "Buy Minutes",
              bgColor: "bg-purple-50",
              btnColor: "bg-purple-600",
            },
            {
              icon: (
                <MessageSquareText className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              ),
              title: "Bingwa SMS Bundles",
              desc: "Send more messages with our Bingwa SMS bundles. Stay in touch with friends and family.",
              href: "/products#sms",
              buttonText: "Buy SMS",
              bgColor: "bg-orange-50",
              btnColor: "bg-orange-600",
            },
            {
              icon: (
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
              ),
              title: "Loyalty Rewards Program",
              desc: "Earn points with every transaction and redeem them for exclusive discounts and free bundles!",
              href: "/loyalty",
              buttonText: "Learn More",
              bgColor: "bg-yellow-50",
              btnColor: "bg-yellow-500",
            },
          ].map((feature, idx) => (
            <Link
              key={idx}
              href={feature.href}
              className={`p-2 sm:p-4 rounded-xl ${feature.bgColor} border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group`}
            >
              {/* Top Section */}
              <div className="flex items-start gap-2">
                <div>{feature.icon}</div>
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="hidden sm:block text-xs sm:text-sm text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`mt-2 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md ${feature.btnColor} text-white text-xs sm:text-sm font-medium group-hover:bg-blue-700 transition-colors duration-300`}
              >
                {feature.buttonText}
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-12 md:py-20 text-center font-inter">
        <h2 className=" font-extrabold mb-12 text-heading">
          Simple Steps to Get Started
        </h2>
        <div className="grid  gap-8 grid-cols-1 md:grid-cols-3 px-4 max-w-7xl mx-auto">
          {[
            {
              step: "1",
              title: "Enter Your Details",
              desc: "Input your mobile number and the desired amount for top-up.",
              color: "from-blue-400 to-blue-600",
              icon: <Smartphone className="w-6 h-6" />,
            },
            {
              step: "2",
              title: "Confirm Payment",
              desc: "You'll receive an M-Pesa STK push. Enter your PIN to confirm the payment.",
              color: "from-green-400 to-green-600",
              icon: <DollarSign className="w-6 h-6" />,
            },
            {
              step: "3",
              title: "Instant Delivery",
              desc: "Your airtime, data, or SMS bundle will be delivered instantly to your phone.",
              color: "from-purple-400 to-purple-600",
              icon: <CheckCircle className="w-6 h-6" />,
            },
          ].map(({ step, title, desc, color, icon }) => (
            <div
              key={step}
              className="p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center bg-white border border-slate-100"
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-6 font-bold text-3xl shadow-lg bg-gradient-to-br ${color} text-white`}
              >
                {icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-800">{title}</h3>
              <p className=" text-center">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-12 md:py-20 text-center font-inter"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-heading mb-12">
          What Our Happy Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mx-auto">
          {[
            {
              name: "Jane M.",
              quote:
                "Mazeltov made buying airtime so smooth. Fast, reliable, and incredibly easy to use!",
              rating: 5,
            },
            {
              name: "Brian K.",
              quote:
                "I love the simplicity and how instant the data bundle service is. Never go offline now!",
              rating: 5,
            },
            {
              name: "Sarah A.",
              quote:
                "Finally, a platform that understands my needs for minutes and SMS. Mazeltov is a lifesaver!",
              rating: 5,
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="flex-1 bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center border border-slate-100"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-5 h-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-lg italic text-gray-700 mb-4 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>
              <p className="text-base font-semibold text-gray-800">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="cta"
        className="py-16 md:py-24 text-center  text-heading relative overflow-hidden font-inter"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          {/* Subtle background SVG shapes for aesthetic appeal */}
          <svg width="100%" height="100%">
            <circle
              cx="20%"
              cy="30%"
              r="120"
              fill="#3b82f6"
              fillOpacity="0.08"
            />
            <circle
              cx="80%"
              cy="70%"
              r="100"
              fill="#64748b"
              fillOpacity="0.06"
            />
            <circle
              cx="60%"
              cy="20%"
              r="80"
              fill="#a5b4fc"
              fillOpacity="0.05"
            />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center  mx-auto">
          <div className="flex justify-center gap-6 mb-8">
            <Wifi className="w-12 h-12 text-blue-600" />
            <MessageSquareText className="w-12 h-12 text-green-600" />
            <PhoneCall className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-heading leading-tight ">
            Ready for Instant Top-ups?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-700 drop-shadow">
            Join thousands of users enjoying seamless airtime, data, and SMS
            services. Experience instant, secure, and affordable top-ups today,
            and{" "}
            <strong className="text-blue-700">
              earn loyalty points with every transaction!
            </strong>
          </p>

          <Link
            href="/products/airtime"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-lg shadow-xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-300 transform focus:outline-none  focus:ring-300"
            aria-label="Buy Airtime Now"
          >
            Buy Airtime Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default LandingPageSections;
