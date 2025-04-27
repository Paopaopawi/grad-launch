import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

const JobListings = () => {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    // Get the job listings from localStorage
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(storedJobs);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Job Listings</h2>
        <div className="row">
          {jobs.length === 0 ? (
            <p className="text-center">No jobs available at the moment.</p>
          ) : (
            jobs.map((job, index) => (
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
                      <strong>Job Type:</strong>{" "}
                      {job.isFullTime ? "Full-time" : "Part-time"}
                    </p>
                    <p>
                      <strong>Company:</strong> {job.companyName}
                    </p>
                    <p>
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

export default JobListings;
