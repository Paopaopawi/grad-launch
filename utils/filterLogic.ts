import { useState, useEffect } from "react";

const useJobFilters = (jobs: any[]) => {
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [workScheduleFilter, setWorkScheduleFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [datePostedFilter, setDatePostedFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  const applyFilters = () => {
    const now = new Date();
    let results = jobs.filter((job) => {
      if (
        jobTypeFilter !== "all" &&
        (job.isFullTime ? "full-time" : "part-time") !== jobTypeFilter
      ) return false;

      if (categoryFilter !== "all" && job.jobCategory !== categoryFilter)
        return false;

      if (regionFilter !== "all" && job.location.region !== regionFilter)
        return false;

      if (
        workScheduleFilter !== "all" &&
        job.workSchedule !== workScheduleFilter
      ) return false;

      if (salaryFilter !== "all") {
        const salary = parseFloat(job.salary);
        if (salaryFilter === "0-20000" && salary > 20000) return false;
        if (salaryFilter === "20000-40000" && (salary <= 20000 || salary > 40000)) return false;
        if (salaryFilter === "40000-60000" && (salary <= 40000 || salary > 60000)) return false;
        if (salaryFilter === "60000+" && salary <= 60000) return false;
      }

      if (datePostedFilter !== "all") {
        const jobDate = new Date(job.dateUploaded);
        const diffDays = (now.getTime() - jobDate.getTime()) / (1000 * 3600 * 24);
        if (datePostedFilter === "24h" && diffDays > 1) return false;
        if (datePostedFilter === "3d" && diffDays > 3) return false;
        if (datePostedFilter === "7d" && diffDays > 7) return false;
        if (datePostedFilter === "30d" && diffDays > 30) return false;
      }

      if (
        searchKeyword &&
        !job.jobTitle.toLowerCase().includes(searchKeyword.toLowerCase())
      ) return false;

      return true;
    });

    setFilteredJobs(results);
  };

  const clearFilters = () => {
    setJobTypeFilter("all");
    setCategoryFilter("all");
    setRegionFilter("all");
    setWorkScheduleFilter("all");
    setSalaryFilter("all");
    setDatePostedFilter("all");
    setSearchKeyword("");
  };

  useEffect(() => {
    applyFilters();
  }, [
    jobs,
    jobTypeFilter,
    categoryFilter,
    regionFilter,
    workScheduleFilter,
    salaryFilter,
    datePostedFilter,
    searchKeyword,
  ]);

  return {
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
  };
};

export default useJobFilters;
