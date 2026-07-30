import React from "react";
import Link from "next/link";

const Blogs = () => {
  // Mock data for now – you can expand this later
  const blogs = [
    {
      slug: "/blogs/how-to-buy-airtime-data-sms-minutes",
      title: "How to Buy Airtime, Data, SMS & Minutes Instantly in Kenya",
      description:
        "Step-by-step guide to purchasing airtime, data bundles, SMS, and minutes online or via Paybill numbers with Mazeltov.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Our Blog
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              <Link href={blog.slug}>{blog.title}</Link>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {blog.description}
            </p>
            <div className="mt-4">
              <Link
                href={blog.slug}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
