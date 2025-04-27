import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    const role = localStorage.getItem("role");

    if (isLoggedIn === "true") {
      // Redirect to respective dashboard if logged in
      if (role === "graduate") {
        router.push("/dashboard");
      } else if (role === "employer") {
        router.push("/employer-dashboard");
      }
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <section className="min-vh-100 d-flex justify-content-center align-items-center bg-gradient-to-tr from-sky-100 to-indigo-200 text-center p-4">
        <div className="container">
          <h1 className="display-4 text-primary font-weight-bold mb-4">
            Welcome to GradLaunch
          </h1>
          <p className="text-muted lead mb-5">
            Helping fresh IT graduates find jobs, build portfolios, and launch
            careers 🚀
          </p>
          <div className="d-flex justify-content-center gap-4">
            <Link
              href="/sign-up"
              target="_blank"
              className="btn btn-primary btn-lg py-3 px-5 rounded-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              target="_blank"
              className="btn btn-outline-primary btn-lg py-3 px-5 rounded-lg"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
