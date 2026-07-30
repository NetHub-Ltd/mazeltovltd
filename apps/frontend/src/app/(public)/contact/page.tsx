"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

const email = process.env.SUPPORT_EMAIL! || "support@mazeltov.co.ke";
const phone = process.env.SUPPORT_PHONE! || "+254 791 178 111";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setStatus("sending");
      console.log("Form data to be sent:", data);
      // Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      reset();
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-8 ">
      <section className="w-full  bg-surface border border-slate-200 shadow-md rounded-lg p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Get In Touch</h1>
          <p className="text-sm text-gray-700">
            We&apos;d love to hear from you. Fill out the form below or contact
            us directly.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Contact Details</h2>
              <p className="text-sm text-gray-700 mb-3">
                Have a question or need assistance? Our team is here to help.
              </p>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <svg
                    aria-hidden
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{email}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    aria-hidden
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{phone}</span>
                </div>

                <div className="flex items-start">
                  <svg
                    aria-hidden
                    className="w-5 h-5 text-blue-600 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <address className="not-italic">
                    123 Digital Avenue,
                    <br />
                    Nairobi, Kenya, 00100
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col">
            <h2 className="text-lg font-medium mb-4">Send Us a Message</h2>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  {...register("name", {
                    required: "Please enter your name",
                    maxLength: { value: 80, message: "Name is too long" },
                  })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-150 ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value:
                        // simple but effective email pattern
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-150 ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message", {
                    required: "Please enter a message",
                    minLength: {
                      value: 10,
                      message: "Message should be at least 10 characters",
                    },
                    maxLength: {
                      value: 2000,
                      message: "Message is too long",
                    },
                  })}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-150 ${
                    errors.message ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || status === "sending"}
                  className="w-full inline-flex items-center justify-center py-3 px-4 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || status === "sending"
                    ? "Sending..."
                    : "Send Message"}
                </button>
              </div>

              {/* Status / Feedback */}
              <div aria-live="polite" className="min-h-[1.25rem]">
                {status === "success" && (
                  <p className="text-center text-sm text-green-600 font-medium">
                    Thank you — we will get back to you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-center text-sm text-red-600 font-medium">
                    Oops — something went wrong. Please try again later.
                  </p>
                )}
                {/* Keep a neutral message when form was programmatically submitted and succeeded via RHF */}
                {isSubmitSuccessful && status === "idle" && (
                  <p className="text-center text-sm text-green-600 font-medium">
                    Submission complete.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
