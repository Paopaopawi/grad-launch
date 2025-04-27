// components/SignOut.tsx
import { useRouter } from "next/router";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = () => {
    // Clear the user session from localStorage
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("role");

    // Redirect to the login page
    router.push("/");
  };

  return (
    <button onClick={handleSignOut} className="btn btn-danger">
      Sign Out
    </button>
  );
};

export default SignOut;
