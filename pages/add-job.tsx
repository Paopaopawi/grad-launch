"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

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
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [workType, setWorkType] = useState("on-site");

  const [employerRole, setEmployerRole] = useState("Unknown");

  const router = useRouter();

  useEffect(() => {
    setEmployerRole(
      localStorage.getItem("role") === "employer" ? "Employer" : "Unknown"
    );
  }, []);

  // Fetch regions
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  }, []);

  // Fetch provinces based on selected region
  useEffect(() => {
    if (selectedRegion) {
      setProvinces([]); // Clear provinces if region changes
      setSelectedProvince(""); // Reset province selection
      fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`)
        .then((res) => res.json())
        .then((data) => setProvinces(data));
    }
  }, [selectedRegion]);

  // Fetch cities based on selected province
  useEffect(() => {
    if (selectedProvince) {
      setCities([]); // Clear cities if province changes
      setSelectedCity(""); // Reset city selection
      fetch(
        `https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`
      )
        .then((res) => res.json())
        .then((data) => setCities(data));
    }
  }, [selectedProvince]);

  // Fetch barangays based on selected city
  useEffect(() => {
    if (selectedCity) {
      setBarangays([]); // Clear barangays if city changes
      fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`
      )
        .then((res) => res.json())
        .then((data) => setBarangays(data));
    }
  }, [selectedCity]);

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !companyName ||
      !jobTitle ||
      !jobDescription ||
      !requirements ||
      !salary ||
      !email ||
      !selectedRegion ||
      !selectedProvince ||
      !selectedCity ||
      !selectedBarangay ||
      !streetAddress ||
      !postalCode
    ) {
      setError("All fields are required.");
      return;
    }

    const loggedInEmail = localStorage.getItem("loggedInEmail"); // Get the logged-in user's email
    if (!loggedInEmail) {
      setError("You must be logged in to post a job.");
      return;
    }

    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");

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
      location: {
        region: selectedRegion,
        province: selectedProvince,
        city: selectedCity,
        barangay: selectedBarangay,
        streetAddress,
        postalCode,
      },
      workType,
      employer: employerRole,
      createdBy: loggedInEmail, // Add createdBy with logged-in email
    };

    const updatedJobs = [...existingJobs, newJob];
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    router.push("/employer-dashboard");
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setSalary(value);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">
          <form
            onSubmit={handleAddJob}
            className="bg-white p-4 rounded shadow mx-auto"
            style={{ maxWidth: "800px" }}
          >
            <h1 className="text-center text-primary mb-4">Add Job Listing</h1>
            {error && <p className="text-danger text-center mb-4">{error}</p>}

            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="E.g., TechCorp"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-control"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="E.g., Software Engineer"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Job Description</label>
              <textarea
                className="form-control"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="E.g., Develop and maintain software applications"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Job Requirements</label>
              <textarea
                className="form-control"
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="E.g., 3+ years of experience in software development"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input
                type="text"
                className="form-control"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="₱"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Job Type</label>
              <select
                className="form-control"
                value={isFullTime ? "full-time" : "part-time"}
                onChange={(e) => setIsFullTime(e.target.value === "full-time")}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Work Type</label>
              <select
                className="form-control"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g., example@company.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Work Days per Week</label>
              <input
                type="number"
                className="form-control"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                min={1}
                max={7}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Time per Day (in hours)</label>
              <input
                type="number"
                className="form-control"
                value={timePerDay}
                onChange={(e) => setTimePerDay(Number(e.target.value))}
                min={1}
                max={12}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="E.g., 123 Main St"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-control"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="E.g., 1234"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Region</label>
              <select
                className="form-control"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                required
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
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                required
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
              <label className="form-label">City</label>
              <select
                className="form-control"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              >
                <option value="">Select City</option>
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
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                required
              >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.code} value={barangay.code}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add Job Listing
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployerAddJob;
