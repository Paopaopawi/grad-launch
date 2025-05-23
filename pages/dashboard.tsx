import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [regions, setRegions] = useState<any[]>([]);
  const [locationMap, setLocationMap] = useState<Record<number, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  // Check window width to toggle sidebar and responsiveness
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Sidebar open only on desktop by default
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(storedJobs);
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

    const [provinceData, cityData, barangayData] = await Promise.all([
      fetch(`https://psgc.gitlab.io/api/regions/${region}/provinces/`).then(
        (r) => r.json()
      ),
      fetch(
        `https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`
      ).then((r) => r.json()),
      fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${city}/barangays/`
      ).then((r) => r.json()),
    ]);

    return {
      provinceName: getLocationName(provinceData, province),
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
    let result = jobs;

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
          <div className="container my-5">
            <h2 className="text-center mb-4">Available Job Listings</h2>

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
                <p className="text-center">No jobs found.</p>
              ) : (
                filteredJobs.map((job, index) => {
                  const location = locationMap[index];
                  const address = location
                    ? `${job.location.postalCode}, ${job.location.streetAddress}, ${location.barangayName}, ${location.cityName}, ${location.provinceName}, ${location.regionName}`
                    : "Loading address...";

                  const formattedDate = job.dateUploaded
                    ? new Date(job.dateUploaded).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <div className="col-md-4 mb-4" key={index}>
                      <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                          <p
                            className="text-muted"
                            style={{ fontSize: "0.85rem" }}
                          >
                            <strong>Date Uploaded:</strong> {formattedDate}
                          </p>
                          <h5 className="card-title">{job.jobTitle}</h5>
                          <p className="card-text text-muted">
                            {job.jobDescription}
                          </p>
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
                            <strong>Company Address:</strong> {address}
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

export default Dashboard;
