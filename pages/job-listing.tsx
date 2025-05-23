import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import router, { useRouter } from "next/router";
import { List } from "react-bootstrap-icons";

const JobListings = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [locationMap, setLocationMap] = useState<Record<number, any>>({});
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
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
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
      localStorage.removeItem("email");
      router.push("/");
    }
  };

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(storedJobs);

    const email = localStorage.getItem("loggedInEmail");
    if (email) setLoggedInEmail(email);
  }, []);

  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  }, []);

  const getLocationName = (
    list: any[],
    code: string | number,
    fallback = "Not Found"
  ) => {
    const found = list.find((item) => String(item.code) === String(code));
    return found?.name || fallback;
  };

  const fetchLocationDetails = async (job: any) => {
    const { region, province, city, barangay } = job.location;
    const isNCR = String(region) === "130000000";

    let cityData: any[] = [];
    let barangayData: any[] = [];

    if (isNCR) {
      cityData = await fetch(
        `https://psgc.gitlab.io/api/regions/${region}/cities/`
      )
        .then((r) => r.json())
        .catch(() => []);
    } else {
      cityData = await fetch(
        `https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`
      )
        .then((r) => r.json())
        .catch(() => []);
    }

    barangayData = await fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${city}/barangays/`
    )
      .then((r) => r.json())
      .catch(() => []);

    let provinceName = "NCR";
    if (!isNCR) {
      const provinceData = await fetch(
        `https://psgc.gitlab.io/api/regions/${region}/provinces/`
      )
        .then((r) => r.json())
        .catch(() => []);
      provinceName = getLocationName(provinceData, province);
    }

    return {
      provinceName,
      cityName: getLocationName(cityData, city),
      barangayName: getLocationName(barangayData, barangay),
    };
  };

  useEffect(() => {
    const loadLocations = async () => {
      const map: Record<number, any> = {};

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        const { region } = job.location;
        const regionName = getLocationName(regions, region);

        try {
          const loc = await fetchLocationDetails(job);
          map[i] = {
            ...loc,
            regionName,
          };
        } catch (err) {
          console.error("Failed to fetch location for job", job, err);
        }
      }

      setLocationMap(map);
    };

    if (regions.length && jobs.length) {
      loadLocations();
    }
  }, [regions, jobs]);

  useEffect(() => {
    let result = jobs.filter((job) => job.isOpen); // Filter out closed jobs

    if (jobTypeFilter !== "all") {
      result = result.filter((job) =>
        jobTypeFilter === "full-time" ? job.isFullTime : !job.isFullTime
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((job) =>
        [job.jobTitle, job.companyName, job.jobDescription, job.email]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, jobTypeFilter, jobs]);

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
          <div className="container my-5">
            <h2 className="text-center mb-4">Job Listings</h2>

            <div className="row mb-4">
              <div className="col-md-8 mb-2">
                <input
                  type="text"
                  placeholder="Search job title, company, or description..."
                  className="form-control p-3 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: "0.75rem", fontSize: "1rem" }}
                />
              </div>
              <div className="col-md-4 mb-2">
                <select
                  className="form-select p-3 shadow-sm"
                  style={{ borderRadius: "0.75rem", fontSize: "1rem" }}
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  <option value="all">All Job Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div className="row">
              {filteredJobs.length === 0 ? (
                <p className="text-center">No jobs available at the moment.</p>
              ) : (
                filteredJobs.map((job, index) => {
                  const location = locationMap[index];
                  const address = location
                    ? `${job.location.postalCode}, ${job.location.streetAddress}, ${location.barangayName}, ${location.cityName}, ${location.provinceName}, ${location.regionName}`
                    : "Loading address...";

                  const NCRaddress = location
                    ? `${job.location.postalCode}, ${job.location.streetAddress}, ${location.barangayName}, ${location.cityName}, ${location.regionName}`
                    : "Loading address...";

                  const formattedDate = job.dateUploaded
                    ? new Date(job.dateUploaded).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : new Date().toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                  return (
                    <div className="col-md-4 mb-4" key={index}>
                      <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                          <p
                            className="text-muted mb-1"
                            style={{ fontSize: "0.9rem" }}
                          >
                            <strong>Date Uploaded:</strong> {formattedDate}
                          </p>

                          <h5 className="card-title">{job.jobTitle}</h5>
                          <p className="card-text">{job.jobDescription}</p>
                          <p>
                            <strong>Company:</strong> {job.companyName}
                          </p>
                          <p>
                            <strong>Email:</strong> {job.email}
                          </p>
                          <p>
                            <strong>Salary:</strong> ₱{job.salary}
                          </p>
                          <p>
                            <strong>Job Type:</strong>{" "}
                            {job.isFullTime ? "Full-time" : "Part-time"}
                          </p>
                          <p>
                            <strong>Work Days:</strong> {job.daysPerWeek} days
                          </p>
                          <p>
                            <strong>Time per Day:</strong> {job.timePerDay}{" "}
                            hours
                          </p>
                          <p>
                            <strong>Company Address:</strong>{" "}
                            {job.location.region === "130000000"
                              ? NCRaddress
                              : address}
                          </p>

                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                              job.email
                            )}&su=${encodeURIComponent(
                              `Application for ${job.jobTitle}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm mt-auto"
                          >
                            Send Resume
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobListings;
