import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("graduate"); // Default role is graduate
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if email already exists
    const userExists = existingUsers.some((user: any) => user.email === email);
    if (userExists) {
      setError("Email is already registered. Please use a different email.");
      return;
    }

    // Add new user
    const newUser = { email, password, role };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Set logged-in state
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("role", role);

    // Redirect based on role
    router.push(role === "graduate" ? "/dashboard" : "/employer-dashboard");
  };

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="w-50 w-md-50 w-lg-40 p-4 bg-white rounded shadow">
          <h2 className="text-center text-primary mb-4">Sign Up</h2>
          {error && <p className="text-danger text-center mb-4">{error}</p>}

          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Role Selection */}
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
          </form>

          <p className="mt-3 text-center text-muted">
            Already have an account?{" "}
            <a href="/login" className="text-primary">
              Log in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
