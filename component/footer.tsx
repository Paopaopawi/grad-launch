"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="bg-dark text-white mt-5 py-5 border-top"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* Brand & About */}
          <div className="col-md-6">
            <h5 className="fw-bold mb-3">GradLaunch</h5>
            <p className="text-muted small">
              Empowering fresh graduates and employers to connect, grow, and
              thrive together. Your career journey begins here.
            </p>
            <p className="small fst-italic text-secondary">
              GradLaunch is your dedicated platform designed to bridge the gap
              between talented new graduates and innovative companies. We make
              professional growth simple and accessible.
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-md-6">
            <h6 className="text-uppercase fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                Email:{" "}
                <a
                  href="mailto:HO@gradLunch.com"
                  className="text-white text-decoration-none hover-opacity"
                >
                  HO@gradLunch.com
                </a>
              </li>
              <li className="mb-2">
                Facebook:{" "}
                <a
                  href="https://facebook.com/GradLaunch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none hover-opacity"
                >
                  facebook.com/GradLaunch
                </a>
              </li>
              <li className="mb-2">
                LinkedIn:{" "}
                <a
                  href="https://business.linkedin.com/GradLaunch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none hover-opacity"
                >
                  business.linkedin.com/GradLaunch
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary mt-4" />

        <div className="text-center mt-3 small text-secondary">
          &copy; {new Date().getFullYear()} GradLaunch. All rights reserved.
        </div>
      </div>

      <style jsx>{`
        a.hover-opacity:hover {
          opacity: 0.75;
          text-decoration: underline;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
