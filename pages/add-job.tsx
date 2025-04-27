import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

const EmployerAddJob = () => {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [isFullTime, setIsFullTime] = useState(true);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [timePerDay, setTimePerDay] = useState(8);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !companyName ||
      !jobTitle ||
      !jobDescription ||
      !requirements ||
      !salary ||
      !email
    ) {
      setError("All fields are required.");
      return;
    }

    // Get existing job listings from localStorage
    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");

    // Create a new job object
    const newJob = {
      companyName,
      jobTitle,
      jobDescription,
      requirements,
      salary,
      isFullTime,
      email,
      daysPerWeek,
      timePerDay,
      employer:
        localStorage.getItem("role") === "employer" ? "Employer" : "Unknown",
    };

    // Add the new job to the existing jobs array
    const updatedJobs = [...existingJobs, newJob];
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    // Redirect to employer dashboard or somewhere else
    router.push("/employer-dashboard");
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Remove any non-numeric characters
    setSalary(value);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <form
          onSubmit={handleAddJob}
          className="bg-white p-4 rounded shadow w-100"
          style={{ maxWidth: "600px" }}
        >
          <h1 className="text-center text-primary mb-4">Add Job Listing</h1>
          {error && <p className="text-danger text-center mb-4">{error}</p>}

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="E.g., TechCorp"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jobTitle" className="form-label">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              className="form-control"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="E.g., Software Engineer"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jobDescription" className="form-label">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              className="form-control"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="E.g., Develop and maintain software applications"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="requirements" className="form-label">
              Job Requirements
            </label>
            <textarea
              id="requirements"
              className="form-control"
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="E.g., 3+ years of experience in software development"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="salary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              id="salary"
              className="form-control"
              value={salary}
              onChange={handleSalaryChange}
              placeholder="$100,000"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="isFullTime" className="form-label">
              Job Type
            </label>
            <select
              id="isFullTime"
              className="form-control"
              value={isFullTime ? "full-time" : "part-time"}
              onChange={(e) =>
                setIsFullTime(e.target.value === "full-time" ? true : false)
              }
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Employer Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E.g., example@company.com"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="daysPerWeek" className="form-label">
              Work Days per Week
            </label>
            <input
              type="number"
              id="daysPerWeek"
              className="form-control"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              min={1}
              max={7}
              placeholder="E.g., 5 days"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <div className="mb-3">
            <label htmlFor="timePerDay" className="form-label">
              Time per Day (in hours)
            </label>
            <input
              type="number"
              id="timePerDay"
              className="form-control"
              value={timePerDay}
              onChange={(e) => setTimePerDay(Number(e.target.value))}
              min={1}
              max={12}
              placeholder="E.g., 8 hours"
              required
              style={{ opacity: 0.6 }} // Lower opacity for placeholder
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Job
          </button>
        </form>
      </div>
    </>
  );
};

export default EmployerAddJob;
