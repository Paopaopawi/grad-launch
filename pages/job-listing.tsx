import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";

const JobListings = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [locationMap, setLocationMap] = useState<Record<number, any>>({});
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(storedJobs);

    // Retrieve logged-in email from localStorage
    const email = localStorage.getItem("loggedInEmail");
    if (email) {
      setLoggedInEmail(email); // Set logged-in email state
    }
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

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Job Listings</h2>
        <div className="row">
          {jobs.length === 0 ? (
            <p className="text-center">No jobs available at the moment.</p>
          ) : (
            jobs.map((job, index) => {
              const location = locationMap[index];
              const address = location
                ? `${job.location.postalCode}, ${job.location.streetAddress}, ${location.barangayName}, ${location.cityName}, ${location.provinceName}, ${location.regionName}`
                : "Loading address...";

              // Format the dateUploaded or use the current date if not available
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
                  <div className="card">
                    <div className="card-body">
                      {/* Date Uploaded */}
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
                        <strong>Time per Day:</strong> {job.timePerDay} hours
                      </p>
                      <p>
                        <strong>Company Address:</strong> {address}
                      </p>

                      {/* Send Resume Button */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          job.email
                        )}&su=${encodeURIComponent(
                          `Application for ${job.jobTitle}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm mt-2"
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
    </>
  );
};

export default JobListings;
