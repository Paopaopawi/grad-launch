"use client";

import { List } from "react-bootstrap-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authStr = localStorage.getItem("auth");
    try {
      const auth = authStr ? JSON.parse(authStr) : null;
      setLoggedIn(auth?.isLoggedIn === true);
    } catch {
      setLoggedIn(false);
    }
  }, []);

  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container d-flex align-items-center justify-content-between">
        {loggedIn ? (
          <div className="d-flex align-items-center">
            <button
              className="btn me-2"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <List size={24} />
            </button>
            <Link className="navbar-brand fw-bold text-primary mb-0" href="/">
              GradLaunch
            </Link>
          </div>
        ) : (
          <>
            <Link className="navbar-brand fw-bold text-primary mb-0" href="/">
              GradLaunch
            </Link>
            <div>
              <Link className="nav-link d-inline me-3" href="/about">
                About Us
              </Link>
              <Link className="nav-link d-inline" href="/login">
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
