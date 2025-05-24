// components/JobModal.tsx
import { add } from "lodash";
import React, { useEffect, useState } from "react";

interface JobModalProps {
  job: any;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, onClose }) => {
  const [locationInfo, setLocationInfo] = useState<any>(null);

  const getLocationName = (
    list: any[],
    code: string | number,
    fallback = "Not Found"
  ) => {
    const found = list.find((item) => String(item.code) === String(code));
    return found?.name || fallback;
  };

  const fetchLocationDetails = async () => {
    const { region, province, city, barangay } = job.location;
    const isNCR = String(region) === "130000000";

    let cityData: any[] = [];
    let barangayData: any[] = [];

    if (isNCR) {
      cityData = await fetch(
        `https://psgc.gitlab.io/api/regions/${region}/cities/`
      ).then((r) => r.json());
    } else {
      cityData = await fetch(
        `https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`
      ).then((r) => r.json());
    }

    barangayData = await fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${city}/barangays/`
    ).then((r) => r.json());

    let provinceName = "NCR";
    if (!isNCR) {
      const provinceData = await fetch(
        `https://psgc.gitlab.io/api/regions/${region}/provinces/`
      ).then((r) => r.json());
      provinceName = getLocationName(provinceData, province);
    }

    const regionData = await fetch(`https://psgc.gitlab.io/api/regions/`)
      .then((r) => r.json())
      .catch(() => []);
    const regionName = getLocationName(regionData, region);

    setLocationInfo({
      provinceName,
      cityName: getLocationName(cityData, city),
      barangayName: getLocationName(barangayData, barangay),
      regionName,
    });
  };

  useEffect(() => {
    if (job?.location) fetchLocationDetails();
  }, [job]);

  const address = locationInfo
    ? `${job.location.postalCode}, ${job.location.streetAddress}, ${locationInfo.barangayName}, ${locationInfo.cityName}, ${locationInfo.provinceName}, ${locationInfo.regionName}`
    : "Loading...";

  const NCRaddress = locationInfo
    ? `${job.location.postalCode}, ${job.location.streetAddress}, ${locationInfo.barangayName}, ${locationInfo.cityName}, ${locationInfo.regionName}`
    : "Loading address...";

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header bg-primary text-white border-0">
            <h5 className="modal-title fw-bold">
              {job?.jobTitle || "Job Details"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3 d-flex flex-wrap gap-2">
              <span className="badge bg-info text-dark">
                <i className="bi bi-tag-fill me-1"></i>
                {job?.jobCategory || "Category N/A"}
              </span>
              <span className="badge bg-success">
                <i className="bi bi-clock-fill me-1"></i>
                {job?.workSchedule || "Schedule N/A"}
              </span>
              <span className="badge bg-warning text-dark">
                <i className="bi bi-currency-dollar me-1"></i>₱
                {job?.salary || "N/A"}
              </span>
              <span className="badge bg-secondary">
                <i className="bi bi-person-fill me-1"></i>
                {job?.isFullTime ? "Full-time" : "Part-time"}
              </span>
              <span className="badge bg-secondary">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {job?.workType === "remote"
                  ? "Remote"
                  : job?.workType === "hybrid"
                  ? "Hybrid"
                  : "On-Site"}
              </span>
            </div>

            <section className="mb-4">
              <h6 className="fw-semibold">Job Description</h6>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {job?.jobDescription || "No description provided."}
              </p>
            </section>

            {job?.requirements && (
              <section className="mb-4">
                <h6 className="fw-semibold">Requirements</h6>
                <p style={{ whiteSpace: "pre-wrap" }}>{job.requirements}</p>
              </section>
            )}

            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold">Days per week</h6>
                <p>{job.daysPerWeek}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold">Date Posted</h6>
                <p>{job.dateUploaded || "N/A"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold">Location</h6>
                <p>
                  {" "}
                  <strong>Company Address:</strong>{" "}
                  {job.location.region === "130000000" ? NCRaddress : address}
                </p>
              </div>
            </div>

            {job?.email && (
              <section className="mt-4">
                <h6 className="fw-semibold">Contact Email</h6>
                <p>{job.email}</p>
              </section>
            )}
          </div>
          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
            <a
              className="btn btn-primary"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                job.email || ""
              )}&su=${encodeURIComponent(`Application for ${job.jobTitle}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now via Gmail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
