// A reusable component for a single skeleton card
const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg bg-gray-200 p-4 shadow-md dark:bg-gray-800">
    <div className="h-40 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
    <div className="mt-4 space-y-2">
      <div className="h-4 w-3/4 rounded-md bg-gray-300 dark:bg-gray-700"></div>
      <div className="h-4 w-full rounded-md bg-gray-300 dark:bg-gray-700"></div>
      <div className="h-4 w-5/6 rounded-md bg-gray-300 dark:bg-gray-700"></div>
    </div>
  </div>
);

// The main loading component
export default function Loading() {
  return (
    <div className="container w-full md:min-w-3xl mx-auto p-4">
      <h1 className="mb-6 animate-pulse text-2xl font-bold text-gray-400 dark:text-gray-600">
        Loading...
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
