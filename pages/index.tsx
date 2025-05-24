import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../component/navbar";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);

      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setIsSidebarOpen(!mobile); // Sidebar visible only on desktop
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    const role = localStorage.getItem("role");

    if (isLoggedIn === "true") {
      if (role === "graduate") {
        router.push("/dashboard");
      } else if (role === "employer") {
        router.push("/employer-dashboard");
      }
    }
  }, [router]);

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <section
        className="position-relative min-vh-100 d-flex align-items-center text-center px-3"
        style={{
          backgroundImage: 'url("/images/index.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <div
          className="position-relative text-white"
          style={{ zIndex: 2, maxWidth: "600px" }}
        ></div>
        {/* Content */}
        <div
          className="container position-relative text-white"
          style={{ zIndex: 2 }}
        >
          <h1 className="display-4 fw-bold mb-3">Welcome to GradLaunch</h1>
          <p className="lead mb-4">
            Helping fresh IT graduates find jobs, build portfolios, and launch
            careers 🚀
          </p>
          <div className="row justify-content-center">
            <div className="col-12 col-md-auto mb-3 mb-md-0">
              <Link href="/sign-up" className="btn btn-primary btn-lg w-100">
                Get Started
              </Link>
            </div>
            <div className="col-12 col-md-auto">
              <Link
                href="/login"
                className="btn btn-outline-light btn-lg w-100"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
