"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../component/navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    const storedAuth = localStorage.getItem("auth");
    const auth = storedAuth ? JSON.parse(storedAuth) : null;

    if (auth?.isLoggedIn) {
      if (auth.role === "graduate") router.push("/dashboard");
      else if (auth.role === "employer") router.push("/employer-dashboard");
    }
    setIsLoading(false);
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
      localStorage.setItem("loggedInEmail", user.email);

      const auth = { email: user.email, role: user.role, isLoggedIn: true };
      localStorage.setItem("auth", JSON.stringify(auth));

      if (user.role === "graduate") router.push("/dashboard");
      else if (user.role === "employer") router.push("/employer-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  if (isLoading || !isClient) return <div>Loading...</div>;

  return (
    <>
      <Navbar toggleSidebar={() => {}} />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
        <form
          onSubmit={handleLogin}
          className="bg-white p-4 rounded shadow w-100"
          style={{ maxWidth: "400px", minWidth: isMobile ? "auto" : "320px" }}
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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="mt-4 text-center small">
            <p>
              Don't have an account yet?{" "}
              <a
                href="/sign-up"
                className="text-primary text-decoration-underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
