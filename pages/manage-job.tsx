"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import jobCategories from "../utils/Jobs";
import Footer from "@/component/footer";
const ManageJob = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [editJob, setEditJob] = useState<any>({
    jobCategory: "",
    jobTitle: "",
    location: {
      region: "",
      province: "",
      city: "",
      barangay: "",
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [filteredJobTitles, setFilteredJobTitles] = useState<string[]>([]);

  const [isFullTime, setIsFullTime] = useState(true);
  const [workSchedule, setWorkSchedule] = useState("day-shift");

  const router = useRouter();
  useEffect(() => {
    if (!editJob || !editJob.jobCategory) {
      setFilteredJobTitles([]);
      setEditJob((prev: any) => ({
        ...prev,
        jobTitle: "",
      }));
      return;
    }

    const titles = jobCategories[editJob.jobCategory] || [];
    setFilteredJobTitles(titles);

    if (!titles.includes(editJob.jobTitle)) {
      setEditJob((prev: any) => ({
        ...prev,
        jobTitle: "",
      }));
    }
  }, [editJob?.jobCategory]);

  // Detect mobile viewport and adjust sidebar open/close
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Sidebar is always open on desktop, toggleable on mobile
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  // Load logged-in user email from localStorage
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    setLoggedInEmail(email);
  }, []);

  // Fetch regions on mount
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch(() => setRegions([]));
  }, []);

  // Load provinces or cities when region changes in editJob
  useEffect(() => {
    if (editJob?.location?.region) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);

      setEditJob({
        ...editJob,
        location: {
          ...editJob.location,
          province: "",
          city: "",
          barangay: "",
        },
      });

      fetch(
        `https://psgc.gitlab.io/api/regions/${editJob.location.region}/provinces/`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length === 0) {
            fetch(
              `https://psgc.gitlab.io/api/regions/${editJob.location.region}/cities-municipalities/`
            )
              .then((res) => res.json())
              .then((citiesData) => setCities(citiesData))
              .catch(() => setCities([]));
          } else {
            setProvinces(data);
          }
        })
        .catch(() => setProvinces([]));
    } else {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }
  }, [editJob?.location?.region]);

  // Load cities when province changes in editJob
  useEffect(() => {
    if (editJob?.location?.province) {
      setCities([]);
      setBarangays([]);

      setEditJob({
        ...editJob,
        location: {
          ...editJob.location,
          city: "",
          barangay: "",
        },
      });

      fetch(
        `https://psgc.gitlab.io/api/provinces/${editJob.location.province}/cities-municipalities/`
      )
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch(() => setCities([]));
    }
  }, [editJob?.location?.province]);

  // Load barangays when city changes in editJob
  useEffect(() => {
    if (editJob?.location?.city) {
      setBarangays([]);

      setEditJob({
        ...editJob,
        location: {
          ...editJob.location,
          barangay: "",
        },
      });

      fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${editJob.location.city}/barangays/`
      )
        .then((res) => res.json())
        .then((data) => setBarangays(data))
        .catch(() => setBarangays([]));
    }
  }, [editJob?.location?.city]);

  // Load user's jobs from localStorage
  useEffect(() => {
    if (loggedInEmail) {
      const savedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const filteredJobs = savedJobs.filter(
        (job: any) => job.createdBy === loggedInEmail
      );
      setJobs(filteredJobs);
    }
  }, [loggedInEmail]);

  // Delete job by id
  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    if (isEditMode && editJob?.id === jobId) {
      setIsEditMode(false);
      setEditJob(null);
    }
  };

  // Edit job - set edit mode and deep clone job
  const handleEditJob = (job: any) => {
    const jobClone = JSON.parse(JSON.stringify(job));
    setEditJob(jobClone);
    setIsEditMode(true);
    setError("");
  };

  // Save edited job
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editJob?.companyName || !editJob?.jobTitle || !editJob?.salary) {
      setError("Company Name, Job Title, and Salary are required.");
      return;
    }

    const updatedJobs = jobs.map((job) =>
      job.id === editJob.id ? { ...editJob } : job
    );

    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    setIsEditMode(false);
    setEditJob(null);
    setError("");
  };

  // Close job listing by ID
  const handleCloseJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, isOpen: false } : job
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  // Open job listing by ID
  const handleOpenJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, isOpen: true } : job
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <main
          className="flex-grow-1"
          style={{
            marginLeft: !isMobile && isSidebarOpen ? 250 : 0,
            padding: "40px 30px",
            backgroundColor: "#f8f9fa",
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
          }}
        >
          <h1 className="text-primary mb-4">Manage Job Listings</h1>

          {error && <p className="text-danger mb-4">{error}</p>}

          <div className="row">
            {jobs.length === 0 && (
              <p className="text-muted">No job listings found.</p>
            )}
            {jobs.map((job) => (
              <div key={job.id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100 d-flex flex-column">
                  <div className="card-body flex-grow-1">
                    <h5 className="card-title">{job.jobTitle}</h5>
                    <p className="card-text">{job.companyName}</p>
                    <p className="card-text">{job.jobDescription}</p>
                    <p className="card-text">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {job.isOpen ? "Open" : "Closed"}
                    </p>
                  </div>
                  <div className="card-footer d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary flex-grow-1 flex-md-grow-0"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to edit this job?"
                          )
                        ) {
                          handleEditJob(job);
                        }
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger flex-grow-1 flex-md-grow-0"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this job? This action cannot be undone."
                          )
                        ) {
                          handleDeleteJob(job.id);
                        }
                      }}
                    >
                      Delete
                    </button>

                    {job.isOpen ? (
                      <button
                        className="btn btn-secondary flex-grow-1 flex-md-grow-0"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to close this job listing?"
                            )
                          ) {
                            handleCloseJob(job.id);
                          }
                        }}
                      >
                        Close Listing
                      </button>
                    ) : (
                      <button
                        className="btn btn-success flex-grow-1 flex-md-grow-0"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to open this job listing?"
                            )
                          ) {
                            handleOpenJob(job.id);
                          }
                        }}
                      >
                        Open Listing
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          {isEditMode && editJob && (
            <div
              className="modal show d-block"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                overflowY: "auto",
              }}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Job Listing</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setIsEditMode(false);
                        setEditJob(null);
                        setError("");
                      }}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    <form onSubmit={handleSaveEdit}>
                      <div className="mb-3">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editJob.companyName}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              companyName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Job Category</label>
                        <select
                          className="form-control"
                          value={editJob.jobCategory}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              jobCategory: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select Category</option>
                          {Object.keys(jobCategories).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Job Title</label>
                        <select
                          className="form-control"
                          value={editJob.jobTitle}
                          onChange={(e) =>
                            setEditJob({ ...editJob, jobTitle: e.target.value })
                          }
                          required
                          disabled={!editJob.jobCategory}
                        >
                          <option value="">Select Job Title</option>
                          {filteredJobTitles.map((title) => (
                            <option key={title} value={title}>
                              {title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Job Description</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={editJob.jobDescription}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              jobDescription: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Job Requirements</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={editJob.requirements}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              requirements: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Salary</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="₱"
                          value={editJob.salary}
                          onChange={(e) =>
                            setEditJob({ ...editJob, salary: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Full-time?</label>
                        <select
                          className="form-select"
                          value={isFullTime ? "yes" : "no"}
                          onChange={(e) =>
                            setIsFullTime(e.target.value === "yes")
                          }
                          required
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Work Days</label>
                        <input
                          type="number"
                          className="form-control"
                          min={1}
                          max={7}
                          value={editJob.workDays}
                          onChange={(e) =>
                            setEditJob({ ...editJob, workDays: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Work Schedule</label>
                        <select
                          className="form-control"
                          value={editJob.workSchedule}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              workSchedule: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="day-shift">Day Shift</option>
                          <option value="night-shift">Night Shift</option>
                          <option value="flexible">Flexible</option>
                          <option value="rotational">Rotational</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contact Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="example@company.com"
                          value={editJob.employerEmail}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              employerEmail: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editJob.location.streetAddress}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                ...editJob.location,
                                streetAddress: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editJob.location.postalCode || ""}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                ...editJob.location,
                                postalCode: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Region</label>
                        <select
                          className="form-control"
                          value={editJob.location.region}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                region: e.target.value,
                                province: "",
                                city: "",
                                barangay: "",
                                streetAddress:
                                  editJob.location.streetAddress || "",
                                postalCode: editJob.location.postalCode || "",
                              },
                            })
                          }
                        >
                          <option value="">Select Region</option>
                          {regions.map((region) => (
                            <option key={region.code} value={region.code}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {provinces.length > 0 && (
                        <div className="mb-3">
                          <label className="form-label">Province</label>
                          <select
                            className="form-select"
                            value={editJob.location.province}
                            onChange={(e) =>
                              setEditJob({
                                ...editJob,
                                location: {
                                  ...editJob.location,
                                  province: e.target.value,
                                  city: "", // Reset dependent values
                                  barangay: "",
                                },
                              })
                            }
                            required
                          >
                            <option value="">Select Province</option>
                            {provinces.map((prov) => (
                              <option key={prov.code} value={prov.code}>
                                {prov.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* City/Municipality */}
                      {cities.length > 0 && (
                        <div className="mb-3">
                          <label className="form-label">
                            City/Municipality
                          </label>
                          <select
                            className="form-control"
                            value={editJob.location.city}
                            onChange={(e) =>
                              setEditJob({
                                ...editJob,
                                location: {
                                  ...editJob.location,
                                  city: e.target.value,
                                  barangay: "", // Reset barangay on city change
                                },
                              })
                            }
                            required
                          >
                            <option value="">Select City/Municipality</option>
                            {cities.map((city) => (
                              <option key={city.code} value={city.code}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Barangay */}
                      {barangays.length > 0 && (
                        <div className="mb-3">
                          <label className="form-label">Barangay</label>
                          <select
                            className="form-control"
                            value={editJob.location.barangay}
                            onChange={(e) =>
                              setEditJob({
                                ...editJob,
                                location: {
                                  ...editJob.location,
                                  barangay: e.target.value,
                                },
                              })
                            }
                            required
                            disabled={!editJob.location.city}
                          >
                            <option value="">Select Barangay</option>
                            {barangays.map((barangay) => (
                              <option key={barangay.code} value={barangay.code}>
                                {barangay.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Work Type</label>
                        <select
                          className="form-control"
                          value={editJob.workType}
                          onChange={(e) =>
                            setEditJob({ ...editJob, workType: e.target.value })
                          }
                        >
                          <option value="on-site">On-Site</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      {/* Modal footer */}
                      <div className="modal-footer flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary flex-grow-1 flex-md-grow-0"
                          onClick={() => {
                            setIsEditMode(false);
                            setEditJob(null);
                            setError("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-grow-1 flex-md-grow-0"
                          onClick={(e) => {
                            if (
                              !window.confirm(
                                "Are you sure you want to save the changes?"
                              )
                            ) {
                              e.preventDefault(); // Prevent form submission if canceled
                            }
                          }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ManageJob;
