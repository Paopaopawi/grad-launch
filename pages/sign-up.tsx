"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("graduate");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some((user: any) => user.email === email);
    if (userExists) {
      setError("Email is already registered. Please use a different email.");
      return;
    }

    const newUser = { email, password, role };
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    const auth = { email, role, isLoggedIn: true };
    localStorage.setItem("auth", JSON.stringify(auth));

    console.log(
      "Users saved:",
      JSON.parse(localStorage.getItem("users") || "[]")
    );
    console.log(
      "Auth saved:",
      JSON.parse(localStorage.getItem("auth") || "{}")
    );

    // Delay navigation slightly to ensure localStorage is saved
    setTimeout(() => {
      if (role === "graduate") {
        router.push("/dashboard");
      } else {
        router.push("/employer-dashboard");
      }
    }, 100);
  };

  return (
    <>
      <Navbar toggleSidebar={() => {}} />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
        <form
          onSubmit={handleSignUp}
          className="bg-white p-4 rounded shadow w-100"
          style={{ maxWidth: "400px", minWidth: isMobile ? "auto" : "320px" }}
          aria-label="Sign Up Form"
        >
          <h2 className="text-center text-primary mb-4">Sign Up</h2>
          {error && (
            <p className="text-danger text-center mb-4" role="alert">
              {error}
            </p>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label">
              Select Your Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="graduate">Graduate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Sign Up
          </button>

          <p className="mt-3 text-center text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary text-decoration-underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
