import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import FilterModal from "../component/jobFilter";
import JobCard from "../component/jobCard";
import JobModal from "../component/jobModal";
import useJobFilters from "../utils/filterLogic";
import Footer from "@/component/footer";

const JobListings = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [locationMap, setLocationMap] = useState<Record<number, any>>({});
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const {
    filteredJobs,
    searchKeyword,
    setSearchKeyword,
    applyFilters,
    clearFilters,
    jobTypeFilter,
    setJobTypeFilter,
    categoryFilter,
    setCategoryFilter,
    regionFilter,
    setRegionFilter,
    workScheduleFilter,
    setWorkScheduleFilter,
    salaryFilter,
    setSalaryFilter,
    datePostedFilter,
    setDatePostedFilter,
  } = useJobFilters(jobs);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(storedJobs);

      const email = localStorage.getItem("loggedInEmail");
      if (email) setLoggedInEmail(email);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const jobCategories = Array.from(
    new Set(jobs.map((job) => job.jobCategory))
  ).filter(Boolean);

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

            <div className="d-flex mb-4 gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search jobs by title..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />

              <button
                className="btn btn-outline-primary"
                onClick={() => setShowFilterModal(true)}
              >
                Filters
              </button>
            </div>

            <FilterModal
              show={showFilterModal}
              onClose={() => setShowFilterModal(false)}
              onApply={() => {
                applyFilters();
                setShowFilterModal(false);
              }}
              onClear={() => {
                clearFilters();
                setShowFilterModal(false);
              }}
              jobTypeFilter={jobTypeFilter}
              setJobTypeFilter={setJobTypeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              regionFilter={regionFilter}
              setRegionFilter={setRegionFilter}
              workScheduleFilter={workScheduleFilter}
              setWorkScheduleFilter={setWorkScheduleFilter}
              salaryFilter={salaryFilter}
              setSalaryFilter={setSalaryFilter}
              datePostedFilter={datePostedFilter}
              setDatePostedFilter={setDatePostedFilter}
              jobCategories={jobCategories}
              regions={regions}
            />

            <div className="row">
              {filteredJobs.length === 0 ? (
                <p className="text-center">No jobs available at the moment.</p>
              ) : (
                filteredJobs.map((job, index) => (
                  <JobCard
                    key={index}
                    job={job}
                    index={index}
                    location={locationMap[index]}
                    onClick={(idx) => {
                      setSelectedJobIndex(idx);
                      setShowJobModal(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {showJobModal && selectedJobIndex !== null && (
        <JobModal
          job={jobs[selectedJobIndex]}
          onClose={() => setShowJobModal(false)}
        />
      )}
      <Footer />
    </>
  );
};

export default JobListings;
