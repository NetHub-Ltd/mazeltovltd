import Link from "next/link";
import Image from "next/image";

export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  tags: string[];
}
const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className="bg-white rounded-lg min-h-100  shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link href={`/blog/${blog.slug}`} passHref>
        <div className="relative w-full h-48 cursor-pointer">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      </Link>
      <div className="p-2 md:p-4 lg:p-6 transition-all duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          <Link href={`/blog/${blog.id}`} passHref>
            <span className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
              {blog.title}
            </span>
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>By {blog.author}</span>
          <span className="mx-2">•</span>
          <span>{blog.date}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/blog/${blog.id}`} passHref>
          <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer">
            Read More
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
