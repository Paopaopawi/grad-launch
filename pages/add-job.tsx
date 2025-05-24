"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import jobCategories from "../utils/Jobs"; // Import job categories
import Footer from "@/component/footer";

const AddJob = () => {
  const router = useRouter();

  // Form state
  const [jobs, setJobs] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [filteredJobTitles, setFilteredJobTitles] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [isFullTime, setIsFullTime] = useState(true);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [timePerDay, setTimePerDay] = useState(8);
  const [email, setEmail] = useState("");
  const [workType, setWorkType] = useState("on-site");
  const [workSchedule, setWorkSchedule] = useState("day-shift");

  // Location states
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

  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check window width to toggle sidebar and responsiveness
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Fetch regions on mount
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  }, []);

  // Load provinces or cities when region changes
  useEffect(() => {
    if (selectedRegion) {
      setProvinces([]);
      setSelectedProvince("");
      setCities([]);
      setSelectedCity("");
      setBarangays([]);
      setSelectedBarangay("");

      fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            fetch(
              `https://psgc.gitlab.io/api/regions/${selectedRegion}/cities-municipalities/`
            )
              .then((res) => res.json())
              .then((citiesData) => {
                setCities(citiesData);
              });
          } else {
            setProvinces(data);
          }
        });
    }
  }, [selectedRegion]);

  // Load cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      setCities([]);
      setSelectedCity("");
      setBarangays([]);
      setSelectedBarangay("");

      fetch(
        `https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`
      )
        .then((res) => res.json())
        .then((data) => setCities(data));
    }
  }, [selectedProvince]);

  // Load barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      setBarangays([]);
      setSelectedBarangay("");

      fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`
      )
        .then((res) => res.json())
        .then((data) => setBarangays(data));
    }
  }, [selectedCity]);

  // Filter job titles based on category selection
  useEffect(() => {
    if (jobCategory && jobCategories[jobCategory]) {
      setFilteredJobTitles(jobCategories[jobCategory]);
      setJobTitle("");
    } else {
      setFilteredJobTitles([]);
      setJobTitle("");
    }
  }, [jobCategory]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setSalary(value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !companyName ||
      !jobCategory ||
      !jobTitle ||
      !jobDescription ||
      !requirements ||
      !salary ||
      !email ||
      !selectedRegion ||
      (provinces.length > 0 && !selectedProvince) ||
      !selectedCity ||
      !selectedBarangay ||
      !streetAddress ||
      !postalCode
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const loggedInEmail = localStorage.getItem("loggedInEmail");
    if (!loggedInEmail) {
      setError("You must be logged in to post a job.");
      return;
    }

    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const day = now.getDate();
    const year = now.getFullYear();

    const dateUploaded = `${month} ${day}, ${year}`;
    const newJob = {
      id:
        crypto.randomUUID?.() ??
        Date.now().toString() + Math.random().toString(36).substring(2, 7),
      companyName,
      jobCategory,
      jobTitle,
      jobDescription,
      requirements,
      salary,
      isFullTime,
      daysPerWeek,
      workSchedule,
      email,
      location: {
        region: selectedRegion,
        province: provinces.length > 0 ? selectedProvince : null,
        city: selectedCity,
        barangay: selectedBarangay,
        streetAddress,
        postalCode,
      },
      workType,
      createdBy: loggedInEmail,
      isOpen: true,
      dateUploaded: dateUploaded,
    };

    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    jobs.push(newJob);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Job uploaded successfully!");
    router.push("/employer-dashboard");
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <main
          className="flex-grow-1"
          style={{
            marginLeft: isMobile || !isSidebarOpen ? 0 : 250,
            padding: isMobile ? "20px 15px" : "40px 60px",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            transition: "margin-left 0.3s ease",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mx-auto"
            style={{
              width: "100%",
              maxWidth: 800,
              boxSizing: "border-box",
            }}
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

            {/* New Job Category dropdown */}
            <div className="mb-3">
              <label className="form-label">Job Category</label>
              <select
                className="form-select"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
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

            {/* Filtered Job Title dropdown */}
            <div className="mb-3">
              <label className="form-label">Job Title</label>
              <select
                className="form-select"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                disabled={!jobCategory}
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
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Requirements</label>
              <textarea
                className="form-control"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Salary (₱)</label>
              <input
                type="text"
                className="form-control"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="E.g., 15000"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Full-time?</label>
              <select
                className="form-select"
                value={isFullTime ? "yes" : "no"}
                onChange={(e) => setIsFullTime(e.target.value === "yes")}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Days per Week</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Work Schedule</label>
              <select
                className="form-select"
                value={workSchedule}
                onChange={(e) => setWorkSchedule(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Location fields */}
            <div className="mb-3">
              <label className="form-label">Region</label>
              <select
                className="form-select"
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

            {provinces.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Province</label>
                <select
                  className="form-select"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
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

            <div className="mb-3">
              <label className="form-label">City / Municipality</label>
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              >
                <option value="">Select City / Municipality</option>
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
                className="form-select"
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                required
              >
                <option value="">Select Barangay</option>
                {barangays.map((brgy) => (
                  <option key={brgy.code} value={brgy.code}>
                    {brgy.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Street, Subdivision, etc."
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
              <label className="form-label">Work Type</label>
              <select
                className="form-select"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                required
              >
                <option value="on-site">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add Job
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AddJob;
