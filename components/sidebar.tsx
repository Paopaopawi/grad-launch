"use client";

import Link from "next/link";
import { X } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [role, setRole] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authStr = localStorage.getItem("auth");
    try {
      const auth = authStr ? JSON.parse(authStr) : null;
      if (auth?.isLoggedIn && auth?.role) {
        setLoggedIn(true);
        setRole(auth.role);
      } else {
        setLoggedIn(false);
        setRole(null);
      }
    } catch (error) {
      console.error("Error parsing auth from localStorage", error);
      setLoggedIn(false);
      setRole(null);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInEmail");
    setLoggedIn(false);
    setRole(null);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div
        className={`bg-dark text-white position-fixed top-0 start-0 h-100 p-4 ${
          isOpen ? "d-block" : "d-none"
        }`}
        style={{ width: "250px", zIndex: 1050 }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!loggedIn || !role) {
    return (
      <div
        className={`bg-dark text-white position-fixed top-5 start-0 h-100 p-4 ${
          isOpen ? "d-block" : "d-none"
        }`}
        style={{ width: "250px", zIndex: 1050 }}
      >
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <strong>Unauthorized</strong>
          <button className="btn btn-sm text-white" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        <p>You are not logged in.</p>
        <Link className="btn btn-outline-light w-100" href="/login">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`bg-dark text-white position-fixed top-5 start-0 h-100 p-4 ${
        isOpen ? "d-block" : "d-none"
      }`}
      style={{ width: "250px", zIndex: 1050 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-white mb-0">
          {role === "graduate" ? "Graduate Panel" : "Employer Panel"}
        </h5>
        <button className="btn btn-sm text-white" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <ul className="nav flex-column">
        {role === "graduate" ? (
          <>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/tips">
                Tips
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/about">
                About
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/employer-dashboard">
                Employer Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/job-listing">
                See Jobs
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/add-job">
                Add Listing
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/manage-job">
                Manage Job
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" href="/about">
                About
              </Link>
            </li>
          </>
        )}
        <li className="nav-item mt-3">
          <button
            className="btn btn-outline-light w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
