import React from "react";

interface Region {
  code: string;
  name: string;
}

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  jobTypeFilter: string;
  setJobTypeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
  workScheduleFilter: string;
  setWorkScheduleFilter: (value: string) => void;
  salaryFilter: string;
  setSalaryFilter: (value: string) => void;
  datePostedFilter: string;
  setDatePostedFilter: (value: string) => void;
  jobCategories: string[];
  regions: Region[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  show,
  onClose,
  onApply,
  onClear,
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
  jobCategories,
  regions,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">Filter Job Listings</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body px-4 py-3">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Job Type</label>
                <select
                  className="form-select"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  <option value="all">All Job Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {jobCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Region</label>
                <select
                  className="form-select"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  {regions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Work Schedule</label>
                <select
                  className="form-select"
                  value={workScheduleFilter}
                  onChange={(e) => setWorkScheduleFilter(e.target.value)}
                >
                  <option value="all">All Schedules</option>
                  <option value="day-shift">Day Shift</option>
                  <option value="night-shift">Night Shift</option>
                  <option value="flexible">Flexible</option>
                  <option value="rotational">Rotational</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Salary Range</label>
                <select
                  className="form-select"
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                >
                  <option value="all">All Ranges</option>
                  <option value="0-20000">₱0 - ₱20,000</option>
                  <option value="20000-40000">₱20,000 - ₱40,000</option>
                  <option value="40000-60000">₱40,000 - ₱60,000</option>
                  <option value="60000+">₱60,000+</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Date Posted</label>
                <select
                  className="form-select"
                  value={datePostedFilter}
                  onChange={(e) => setDatePostedFilter(e.target.value)}
                >
                  <option value="all">Any Time</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="3d">Last 3 days</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={onClear}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={onApply}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
