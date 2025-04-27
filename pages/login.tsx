"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const [isClient, setIsClient] = useState(false); // To check if we're on the client-side

  useEffect(() => {
    setIsClient(true); // Set client-side flag to true after component mounts

    const isLoggedIn = localStorage.getItem("userLoggedIn");
    const role = localStorage.getItem("role");

    if (isLoggedIn === "true") {
      if (role === "graduate") {
        router.push("/dashboard");
      } else if (role === "employer") {
        router.push("/employer-dashboard");
      }
    }

    setIsLoading(false); // Once we've checked the login status, set loading to false
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("role", user.role);

      if (user.role === "graduate") {
        router.push("/dashboard");
      } else if (user.role === "employer") {
        router.push("/employer-dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  if (isLoading || !isClient) {
    return <div>Loading...</div>; // Show loading message while checking login state
  }

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <form
          onSubmit={handleLogin}
          className="bg-white p-4 rounded shadow w-100"
          style={{ maxWidth: "400px" }}
        >
          <h1 className="text-center text-primary mb-4">Login</h1>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="mt-4 text-center">
            <p>
              Don't have an account yet?{" "}
              <a href="/sign-up" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
