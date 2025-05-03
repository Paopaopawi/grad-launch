import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

const Dashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(storedJobs);
    setFilteredJobs(storedJobs);
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      [job.jobTitle, job.companyName, job.jobDescription]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Available Job Listings</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search job title, company, or description..."
            className="form-control p-3 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: "0.75rem", fontSize: "1rem" }}
          />
        </div>

        <div className="row">
          {filteredJobs.length === 0 ? (
            <p className="text-center">No jobs found.</p>
          ) : (
            filteredJobs.map((job, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{job.jobTitle}</h5>
                    <p className="card-text text-muted">{job.jobDescription}</p>
                    <p className="mb-1">
                      <strong>Company:</strong> {job.companyName}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {job.email}
                    </p>
                    <p className="mb-1">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                    <p className="mb-1">
                      <strong>Job Type:</strong>{" "}
                      {job.isFullTime ? "Full-time" : "Part-time"}
                    </p>
                    <p className="mb-1">
                      <strong>Work Days:</strong> {job.daysPerWeek} days
                    </p>
                    <p>
                      <strong>Time per Day:</strong> {job.timePerDay} hours
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
