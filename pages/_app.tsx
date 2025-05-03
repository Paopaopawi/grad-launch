// _app.tsx

import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported globally
import { useEffect } from "react";
import { regions, provinces, municipalities, barangays } from "psgc";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App({ Component, pageProps }: any) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js"); // Dynamically load Bootstrap JS
    }
  }, []);

  return <Component {...pageProps} />;
}

export default App;
