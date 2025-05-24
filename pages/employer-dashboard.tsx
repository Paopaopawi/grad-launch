"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import Footer from "@/component/footer";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const employerEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleDeleteJob = (jobIndex: number) => {
    const updatedJobs = [...jobs];
    updatedJobs.splice(jobIndex, 1);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const handleEditJob = (jobIndex: number) => {
    const jobToEdit = jobs[jobIndex];
    router.push({
      pathname: "/employer-edit-job",
      query: { jobId: jobToEdit.id },
    });
  };

  const handleCloseJob = (jobIndex: number) => {
    const updatedJobs = [...jobs];
    updatedJobs[jobIndex].isClosed = true;
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  return (
    <>
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
          <h2 className="text-center mb-5">Employer Dashboard</h2>

          {error && <p className="text-danger text-center mb-4">{error}</p>}

          {/* Welcome & Promotion Section */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-info p-3">
                <div className="card-body">
                  <h4 className="card-title text-primary mb-3">
                    Welcome to GradLaunch
                  </h4>
                  <p>
                    GradLaunch connects you with fresh IT graduates. Post jobs,
                    track applications, and hire efficiently through our simple
                    platform. Our user-friendly interface allows you to manage
                    your job listings with ease, ensuring you find the right
                    candidates quickly.
                  </p>
                  <p>
                    Remember, your first three job listings are free! Take
                    advantage of this opportunity to attract top talent.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-warning p-3">
                <div className="card-body">
                  <h4 className="card-title text-warning mb-3">🎉 Promotion</h4>
                  <p>
                    Your first 3 job listings are <strong>FREE</strong>!
                    Maximize visibility and reach the right candidates quickly.
                    After your free listings, enjoy competitive pricing that
                    ensures you get the best value for your recruitment needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Tips */}
          <div className="card mb-5 shadow-sm border-success p-3">
            <div className="card-body">
              <h4 className="text-success mb-4">
                📘 Hiring Tips for Employers
              </h4>
              <div className="accordion" id="hiringTips">
                {[
                  {
                    id: "1",
                    title: "✅ Write Clear Job Descriptions",
                    content:
                      "Use simple, direct language to explain responsibilities and required skills. A well-defined job description attracts the right candidates and reduces the number of unqualified applications.",
                  },
                  {
                    id: "2",
                    title: "✅ Promote Company Culture",
                    content:
                      "Mention work environment, perks, and growth opportunities. Candidates are often looking for a workplace that aligns with their values and offers a supportive culture.",
                  },
                  {
                    id: "3",
                    title: "✅ Offer Flexibility",
                    content:
                      "Allow hybrid or remote work to attract more candidates. Flexibility in work arrangements can significantly increase your pool of applicants.",
                  },
                ].map((tip) => (
                  <div className="accordion-item mb-2" key={tip.id}>
                    <h2 className="accordion-header" id={`tip${tip.id}`}>
                      <button
                        className={`accordion-button ${
                          tip.id !== "1" ? "collapsed" : ""
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${tip.id}`}
                        aria-expanded={tip.id === "1"}
                        aria-controls={`collapse${tip.id}`}
                      >
                        {tip.title}
                      </button>
                    </h2>
                    <div
                      id={`collapse${tip.id}`}
                      className={`accordion-collapse collapse ${
                        tip.id === "1" ? "show" : ""
                      }`}
                      aria-labelledby={`tip${tip.id}`}
                      data-bs-parent="#hiringTips"
                    >
                      <div className="accordion-body">{tip.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="row g-4">
            {jobs.length === 0 ? (
              <p className="text-center">You have no job listings.</p>
            ) : (
              jobs.map((job, index) => {
                if (job.email !== employerEmail) return null;

                const { location } = job;
                const fullAddress = `${location?.barangay || "N/A"}, ${
                  location?.city || "N/A"
                }, ${location?.province || "N/A"}, ${
                  location?.region || "N/A"
                }`;
                const workType =
                  job.workType === "remote"
                    ? "Remote"
                    : job.workType === "hybrid"
                    ? "Hybrid"
                    : "On-Site";

                return (
                  <div className="col-md-6 col-lg-4" key={index}>
                    <div className="card shadow-sm h-100 p-3">
                      <div className="card-body">
                        <h5 className="card-title">{job.jobTitle}</h5>
                        <p className="card-text">{job.jobDescription}</p>
                        <p>
                          <strong>Email:</strong> {job.email}
                        </p>
                        <p>
                          <strong>Salary:</strong> ${job.salary}
                        </p>
                        <p>
                          <strong>Job Type:</strong> {workType}
                        </p>
                        <p>
                          <strong>Location:</strong> {fullAddress}
                        </p>

                        <div className="d-flex justify-content-between mt-3">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditJob(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteJob(index)}
                          >
                            Delete
                          </button>
                          {job.isClosed ? (
                            <button className="btn btn-secondary" disabled>
                              Closed
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleCloseJob(index)}
                            >
                              Close Job
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default EmployerDashboard;
