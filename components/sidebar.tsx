"use client";

import Link from "next/link";
import { HouseDoor, PlusSquare, Briefcase } from "react-bootstrap-icons";

const Sidebar = () => {
  return (
    <div
      className="bg-dark text-white d-flex flex-column p-3"
      style={{
        height: "100vh",
        width: "250px",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4 className="text-center mb-4">Employer Panel</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link
            href="/employer-dashboard"
            className="nav-link text-white d-flex align-items-center gap-2"
          >
            <HouseDoor size={18} /> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            href="/add-job"
            className="nav-link text-white d-flex align-items-center gap-2"
          >
            <PlusSquare size={18} /> Add Job Listing
          </Link>
        </li>
        <li className="nav-item">
          <Link
            href="/manage-job"
            className="nav-link text-white d-flex align-items-center gap-2"
          >
            <Briefcase size={18} /> Manage Jobs
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
