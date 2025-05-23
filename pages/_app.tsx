// _app.tsx

import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported globally
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { regions, provinces, municipalities, barangays } from "psgc";

function App({ Component, pageProps }: any) {
  const router = useRouter();

  useEffect(() => {
    // Dynamically load Bootstrap JS
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");

      const publicPaths = ["/", "/login", "/sign-up"];
      const isPublicPath = publicPaths.includes(router.pathname);

      const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

      if (!isLoggedIn && !isPublicPath) {
        router.push("/index");
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default App;
