"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import Footer from "@/component/footer";

const AboutPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  return (
    <>
      {" "}
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <main
          className="flex-grow-1"
          style={{
            marginLeft: isMobile || !isSidebarOpen ? 0 : "250px",
            padding: "40px 30px",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            transition: "margin-left 0.3s ease",
          }}
        >
          <div className="container py-5">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary">About Us</h1>
              <p className="lead text-secondary">
                Welcome to <strong>GradLaunch</strong> — your gateway to
                professional growth. Whether you're a graduate or an employer,
                we’re here to help you launch your journey with confidence.
              </p>
            </div>

            {/* Audience Sections */}
            <div className="row g-4 mb-5">
              {/* Fresh Graduates */}
              <div className="col-md-6">
                <div className="bg-white border border-light shadow-lg rounded p-4 h-100 hover-shadow">
                  <h2 className="h4 text-primary border-bottom pb-2 mb-3">
                    For Fresh Graduates
                  </h2>
                  <p>
                    GradLaunch is your stepping stone toward a promising career.
                    We match you with the most relevant job opportunities based
                    on your field and interests. Start strong — join us and let
                    your legacy begin!
                  </p>
                </div>
              </div>

              {/* Employers */}
              <div className="col-md-6">
                <div className="bg-white border border-light shadow-lg rounded p-4 h-100 hover-shadow">
                  <h2 className="h4 text-success border-bottom pb-2 mb-3">
                    For Employers
                  </h2>
                  <p>
                    Whether you’re a startup or an established firm, we help you
                    discover rising talent eager to contribute. Build dynamic
                    teams, grow your workforce, and make meaningful connections
                    with fresh graduates.
                  </p>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-light rounded border p-4 shadow-sm mb-5">
              <h2 className="h4 text-dark mb-3">Our Story</h2>
              <p>
                <strong>GradLaunch</strong> was founded by{" "}
                <strong>Joshua B. Heven</strong> on January 28, 2025, together
                with Bruce Riego C. Marquez, Paolo DL. Almendra, Zion Benjamin
                B. Antones, and Stephen Ulrich D. Carabio.
              </p>
              <p>
                Born out of a mission to bridge the gap between fresh graduates
                and companies, GradLaunch now empowers job seekers and employers
                with a platform that opens doors to great possibilities.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white border shadow-sm rounded p-4 text-center">
              <h2 className="h5 text-primary mb-3">Got Suggestions?</h2>
              <p className="text-muted mb-3">
                We’d love to hear from you. Reach out to us through the channels
                below:
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:HO@gradLunch.com"
                    className="text-decoration-none text-primary"
                  >
                    HO@gradLunch.com
                  </a>
                </li>
                <li className="mb-2">
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href="https://business.linkedin.com/GradLaunch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-primary"
                  >
                    business.linkedin.com/GradLaunch
                  </a>
                </li>
                <li>
                  <strong>Facebook:</strong>{" "}
                  <a
                    href="https://facebook.com/GradLaunch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-primary"
                  >
                    GradLaunch
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};
export default AboutPage;
