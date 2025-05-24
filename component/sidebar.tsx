"use client";

import Link from "next/link";
import {
  X,
  BoxArrowRight,
  InfoCircle,
  Speedometer2,
  Briefcase,
  PlusCircle,
  ClipboardData,
  Lightbulb,
} from "react-bootstrap-icons";
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
        className={`sidebar bg-dark text-white position-fixed top-10 start-0 h-100 p-4 ${
          isOpen ? "d-block" : "d-none"
        }`}
        style={{ width: "250px", zIndex: 1050 }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  const navItem = (href: string, label: string, Icon: any) => (
    <li className="nav-item mb-2">
      <Link
        className="nav-link text-white d-flex align-items-center gap-2"
        href={href}
      >
        <Icon size={18} />
        <span className="fw-medium">{label}</span>
      </Link>
    </li>
  );
  return (
    <div
      className={`sidebar bg-dark text-white position-fixed top-5 start-0 h-100 p-4 ${
        isOpen ? "d-block" : "d-none"
      }`}
      style={{ width: "250px", zIndex: 1050 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-white text-uppercase fw-bold mb-0">
          {role === "graduate" ? "Graduate Panel" : "Employer Panel"}
        </h5>
        <button className="btn btn-sm text-white" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <ul className="nav flex-column">
        {role === "graduate" ? (
          <>
            {navItem("/dashboard", "Dashboard", Speedometer2)}
            {navItem("/job-listing", "See Jobs", Briefcase)}
            {navItem("/aboutPage", "About", InfoCircle)}
          </>
        ) : (
          <>
            {navItem("/employer-dashboard", "Dashboard", Speedometer2)}
            {navItem("/job-listing", "See Jobs", Briefcase)}
            {navItem("/add-job", "Add Listing", PlusCircle)}
            {navItem("/manage-job", "Manage Job", ClipboardData)}
            {navItem("/aboutPage", "About", InfoCircle)}
          </>
        )}
        <li className="nav-item mt-3">
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <BoxArrowRight size={18} />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
