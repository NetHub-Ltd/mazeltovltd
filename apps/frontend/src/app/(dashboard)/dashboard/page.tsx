import { auth } from "@/lib/auth";

const Homepage = async () => {
  const session = await auth();
  return (
    <div className="bg-white p-4 shadow min-w-3xl mx-auto rounded-lg">
      <h1 className="text-xl">Dashboard</h1>
      <p>Welcome {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Homepage;
