interface JobCardProps {
  job: any; // job object that includes isOpen
  index: number;
  location: any;
  onClick: (index: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, index, location, onClick }) => {
  if (!job.isOpen) return null; // hide if closed

  const address = location
    ? `${job.location.postalCode}, ${job.location.streetAddress}, ${location.barangayName}, ${location.cityName}, ${location.provinceName}, ${location.regionName}`
    : "Loading address...";

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
            <strong>Date Uploaded:</strong> {job.dateUploaded}
          </p>
          <h5 className="card-title">{job.jobTitle}</h5>
          <p>
            <strong>Category:</strong> {job.jobCategory || "N/A"}
          </p>
          <p className="card-text">{job.jobDescription}</p>
          <button
            className="btn btn-primary mt-auto"
            onClick={() => onClick(index)}
          >
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
