import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent render issues
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userLoggedIn = localStorage.getItem("userLoggedIn");
      const userRole = localStorage.getItem("role");

      if (userLoggedIn === "true") {
        setLoggedIn(true);
        setRole(userRole);
      } else {
        setLoggedIn(false);
        setRole(null);
      }
      setIsLoading(false); // Mark loading as false after fetching the data
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("role");
      setLoggedIn(false);
      setRole(null);
      router.push("/"); // Redirect to login page after logout
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading until state is set
  }

  const logoLink = loggedIn
    ? role === "graduate"
      ? "/dashboard"
      : "/employer-dashboard"
    : "/";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" href={logoLink}>
          GradLaunch
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!loggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/login" target="_blank">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/sign-up" target="_blank">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : role === "employer" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/job-listing">
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : role === "graduate" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/job-listing">
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/tips">
                    Tips
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
