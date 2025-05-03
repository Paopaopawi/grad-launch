import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar"; // Import Sidebar component

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const employerEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);
    }
  }, []);

  const handleDeleteJob = (jobIndex: number) => {
    if (typeof window !== "undefined") {
      const updatedJobs = [...jobs];
      updatedJobs.splice(jobIndex, 1);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
    }
  };

  const handleEditJob = (jobIndex: number) => {
    const jobToEdit = jobs[jobIndex];
    router.push({
      pathname: "/employer-edit-job",
      query: { jobId: jobToEdit.id },
    });
  };

  const handleCloseJob = (jobIndex: number) => {
    if (typeof window !== "undefined") {
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex].isClosed = true;
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
    }
  };

  const handleAddJob = () => {
    router.push("/employer-add-job");
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="container my-5 flex-grow-1">
          <h2 className="text-center mb-4">Employer Dashboard</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="row">
            {jobs.length === 0 ? (
              <p className="text-center">You have no job listings.</p>
            ) : (
              jobs.map((job, index) => {
                if (job.email !== employerEmail) return null;

                const { location } = job;
                const region = location?.region || "N/A";
                const province = location?.province || "N/A";
                const city = location?.city || "N/A";
                const barangay = location?.barangay || "N/A";
                const fullAddress = `${barangay}, ${city}, ${province}, ${region}`;
                const workType =
                  job.workType === "remote"
                    ? "Remote"
                    : job.workType === "hybrid"
                    ? "Hybrid"
                    : "On-Site";

                return (
                  <div className="col-md-4 mb-4" key={index}>
                    <div className="card">
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

                        <div className="d-flex justify-content-between">
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
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
