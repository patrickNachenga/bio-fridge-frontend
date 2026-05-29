import React, { useState } from "react";
import { getPercentageColor } from "../../helpers/PercentageColorHelper";

const FridgeAdvancedTable = ({
  fridges,
  loading,
  onRowClick,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const getSortedFridges = () => {
    if (!fridges || fridges.length === 0) return [];
    return [...fridges].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <i className="bx bx-chevrons-down text-muted ms-1"></i>;
    }
    return sortConfig.direction === "asc" ? (
      <i className="bx bx-chevron-up text-primary ms-1"></i>
    ) : (
      <i className="bx bx-chevron-down text-primary ms-1"></i>
    );
  };

  return (
    <div className="table-responsive animate__animated animate__fadeInUp animate__faster">
      <table className="table table-hover table-align-middle mb-0 table-bordered">
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th style={{ width: "50px" }}>
              <i className="bx bx-expand"></i>
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
              Fridge Name
              <SortIcon columnKey="name" />
            </th>
            <th style={{ width: "120px", cursor: "pointer" }} onClick={() => handleSort("created_at")}>
              Registered <SortIcon columnKey="created_at" />
            </th>
            <th style={{ width: "100px" }}>Serial</th>
            <th style={{ width: "90px", cursor: "pointer" }} onClick={() => handleSort("minimum_temperature")}>
              Min Temp <SortIcon columnKey="minimum_temperature" />
            </th>
            <th style={{ width: "90px", cursor: "pointer" }} onClick={() => handleSort("maximum_temperature")}>
              Max Temp <SortIcon columnKey="maximum_temperature" />
            </th>
            <th style={{ width: "70px", cursor: "pointer" }} onClick={() => handleSort("block_number")}>
              Blocks <SortIcon columnKey="block_number" />
            </th>
            <th style={{ width: "140px" }}>Capacity</th>
            <th style={{ width: "80px" }}>Status</th>
            <th style={{ width: "100px" }}>Actions</th>
          </tr>
        </thead>
        <tbody className="table-border-bottom-0">
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading fridges...</p>
              </td>
            </tr>
          ) : !fridges || fridges.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-4">
                <i className="bx bx-inbox text-muted" style={{ fontSize: "2rem" }}></i>
                <p className="text-muted mt-2">No frigdes found</p>
              </td>
            </tr>
          ) : (
            getSortedFridges().map((fridge, index) => {
              const percent = fridge.capacity <= 0 ? 0 : ((fridge.sample_number / fridge.capacity) * 100).toFixed(2);
              const isExpanded = expandedRow === fridge.uid;

              return (
                <React.Fragment key={fridge.uid}>
                  <tr
                    style={{
                      backgroundColor: isExpanded ? "#f8f9fa" : "inherit",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <td>
                      <button
                        className="btn btn-sm btn-text-primary"
                        onClick={() => setExpandedRow(isExpanded ? null : fridge.uid)}
                      >
                        <i className={`bx ${isExpanded ? "bx-chevron-down" : "bx-chevron-right"}`}></i>
                      </button>
                    </td>
                    <td className="fw-medium">
                      <div>
                        {fridge.name}
                        <br />
                        <code className="text-muted small">({fridge.code})</code>
                      </div>
                    </td>
                    <td className="fw-medium text-center">
                      <div>
                        {new Date(fridge.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                        <br />
                        <small className="text-muted">
                          {new Date(fridge.created_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </td>
                    <td className="fw-medium small">{fridge.serial_number}</td>
                    <td className="fw-medium text-center">{fridge.minimum_temperature}°C</td>
                    <td className="fw-medium text-center">{fridge.maximum_temperature}°C</td>
                    <td className="fw-medium text-center">
                      <span className="badge bg-label-info">{fridge.block_number}</span>
                    </td>
                    <td className="fw-medium">
                      <div className="d-flex flex-column">
                        <small className="text-center mb-2">
                          {fridge.sample_number} / {fridge.capacity}
                        </small>
                        <div className="progress" style={{ height: "20px" }}>
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: getPercentageColor(percent),
                            }}
                            aria-valuenow={percent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            <small className="fw-bold">{percent}%</small>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${fridge.is_active ? "bg-label-success" : "bg-label-danger"}`}
                      >
                        <i className={`bx ${fridge.is_active ? "bx-check-circle" : "bx-x-circle"}`}></i>
                        {fridge.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-icon btn-text-secondary rounded-pill"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onRowClick(fridge)}
                            >
                              <i className="bx bx-show me-2"></i>View
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onEdit(fridge)}
                            >
                              <i className="bx bx-pencil me-2"></i>Edit
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => onDelete(fridge)}
                            >
                              <i className="bx bx-trash me-2"></i>Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td colSpan="10">
                        <div className="card mt-2 mb-2 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <h6 className="fw-bold mb-3">
                                  <i className="bx bx-info-circle me-2"></i>
                                  Fridge Information
                                </h6>
                                <div className="mb-3">
                                  <small className="text-muted d-block">Model</small>
                                  <strong>{fridge.model}</strong>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block">Status</small>
                                  <strong>
                                    <span
                                      className={`badge bg-label-${
                                        fridge.status === "ACTIVE"
                                          ? "success"
                                          : fridge.status === "FULL"
                                          ? "warning"
                                          : "info"
                                      }`}
                                    >
                                      {fridge.status}
                                    </span>
                                  </strong>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block">Temperature Range</small>
                                  <strong>
                                    {fridge.minimum_temperature}°C to {fridge.maximum_temperature}°C
                                  </strong>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <h6 className="fw-bold mb-3">
                                  <i className="bx bx-stats me-2"></i>
                                  Storage Statistics
                                </h6>
                                <div className="mb-3">
                                  <small className="text-muted d-block">Total Blocks</small>
                                  <strong>{fridge.block_number}</strong>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block">Total Samples</small>
                                  <strong>{fridge.sample_number}</strong>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block">Total Capacity</small>
                                  <strong>{fridge.capacity}</strong>
                                </div>
                              </div>
                            </div>
                            {fridge.description && (
                              <div className="mt-3 pt-3 border-top">
                                <small className="text-muted d-block mb-2">Description</small>
                                <p className="mb-0 text-break">{fridge.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FridgeAdvancedTable;
