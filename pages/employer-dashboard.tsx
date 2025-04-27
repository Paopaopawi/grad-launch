import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

const EmployerDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in and has the employer role
    if (typeof window !== "undefined") {
      const userLoggedIn = localStorage.getItem("userLoggedIn");
      const userRole = localStorage.getItem("role");

      if (userLoggedIn === "true" && userRole === "employer") {
        setLoggedIn(true);
        setRole(userRole);
      } else {
        // Redirect to login if the user is not an employer
        router.push("/login");
      }

      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading while checking status
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Employer Dashboard
          </h2>
          <p className="text-center text-gray-600">
            Welcome to your employer dashboard! Here you can manage your job
            listings and more.
          </p>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
