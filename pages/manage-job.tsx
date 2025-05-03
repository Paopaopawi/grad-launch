"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const ManageJob = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [editJob, setEditJob] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const router = useRouter();

  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  // Set loggedInEmail from localStorage after the component mounts (client-side only)
  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    setLoggedInEmail(email);
  }, []);

  // Fetch regions
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  }, []);

  // Fetch provinces based on selected region
  useEffect(() => {
    if (editJob?.location?.region) {
      setProvinces([]); // Clear provinces if region changes
      fetch(
        `https://psgc.gitlab.io/api/regions/${editJob.location.region}/provinces/`
      )
        .then((res) => res.json())
        .then((data) => setProvinces(data));
    }
  }, [editJob?.location?.region]);

  // Fetch cities based on selected province
  useEffect(() => {
    if (editJob?.location?.province) {
      setCities([]); // Clear cities if province changes
      fetch(
        `https://psgc.gitlab.io/api/provinces/${editJob.location.province}/cities-municipalities/`
      )
        .then((res) => res.json())
        .then((data) => setCities(data));
    }
  }, [editJob?.location?.province]);

  // Fetch barangays based on selected city
  useEffect(() => {
    if (editJob?.location?.city) {
      setBarangays([]); // Clear barangays if city changes
      fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${editJob.location.city}/barangays/`
      )
        .then((res) => res.json())
        .then((data) => setBarangays(data));
    }
  }, [editJob?.location?.city]);

  // Fetch jobs when the component mounts
  useEffect(() => {
    if (loggedInEmail) {
      const savedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const filteredJobs = savedJobs.filter(
        (job: any) => job.createdBy === loggedInEmail
      );
      setJobs(filteredJobs);
    }
  }, [loggedInEmail]);

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const handleEditJob = (job: any) => {
    setEditJob(job);
    setIsEditMode(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();

    // Relaxed validation: Only check for critical fields
    if (!editJob.companyName || !editJob.jobTitle || !editJob.salary) {
      setError("Company Name, Job Title, and Salary are required.");
      return;
    }

    // Update job list with the edited job
    const updatedJobs = jobs.map((job) =>
      job.id === editJob.id ? { ...editJob, isOpen: editJob.isOpen } : job
    );

    // Save updated jobs in local storage
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    // Update the jobs in state and close edit mode
    setJobs(updatedJobs);
    setIsEditMode(false);
  };

  const handleCloseJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, isOpen: false } : job
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const handleOpenJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, isOpen: true } : job
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">
          <h1 className="text-center text-primary mb-4">Manage Job Listings</h1>

          {error && <p className="text-danger text-center mb-4">{error}</p>}

          <div className="row">
            {jobs.map((job) => (
              <div key={job.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job.jobTitle}</h5>
                    <p className="card-text">{job.companyName}</p>
                    <p className="card-text">{job.jobDescription}</p>
                    <p className="card-text">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {job.isOpen ? "Open" : "Closed"}
                    </p>

                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEditJob(job)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger me-2"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>

                    {job.isOpen ? (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleCloseJob(job.id)}
                      >
                        Close Listing
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => handleOpenJob(job.id)}
                      >
                        Open Listing
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isEditMode && editJob && (
            <div
              className="modal show d-block"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Job Listing</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setIsEditMode(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
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
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Job Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editJob.jobTitle}
                          onChange={(e) =>
                            setEditJob({ ...editJob, jobTitle: e.target.value })
                          }
                        />
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
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Job Type</label>
                        <select
                          className="form-control"
                          value={editJob.jobType}
                          onChange={(e) =>
                            setEditJob({ ...editJob, jobType: e.target.value })
                          }
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                        </select>
                      </div>

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

                      <div className="mb-3">
                        <label className="form-label">Employer Email</label>
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
                        <label className="form-label">Time per Day</label>
                        <input
                          type="number"
                          className="form-control"
                          min={1}
                          max={12}
                          value={editJob.timePerDay}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              timePerDay: e.target.value,
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
                          value={editJob.location.postalCode}
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
                          value={editJob.location?.region || ""}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                ...editJob.location,
                                region: e.target.value,
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

                      <div className="mb-3">
                        <label className="form-label">Province</label>
                        <select
                          className="form-control"
                          value={editJob.location?.province || ""}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                ...editJob.location,
                                province: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Select Province</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">City/Municipality</label>
                        <select
                          className="form-control"
                          value={editJob.location?.city || ""}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                ...editJob.location,
                                city: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Select City/Municipality</option>
                          {cities.map((city) => (
                            <option key={city.code} value={city.code}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Barangay</label>
                        <select
                          className="form-control"
                          value={editJob.location?.barangay || ""}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              location: {
                                ...editJob.location,
                                barangay: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Select Barangay</option>
                          {barangays.map((barangay) => (
                            <option key={barangay.code} value={barangay.code}>
                              {barangay.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageJob;
