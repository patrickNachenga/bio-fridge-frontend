import React from "react";
import { getPercentageColor } from "../../helpers/PercentageColorHelper";
import { useNavigate } from "react-router-dom";

const FridgeDetailPanel = ({ fridge, onClose, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!fridge) return null;

  const percent = fridge.capacity <= 0 ? 0 : ((fridge.sample_number / fridge.capacity) * 100).toFixed(2);

  return (
    <div
      className="offcanvas offcanvas-end show"
      tabIndex="-1"
      id="fridgeDetailPanel"
      style={{ visibility: "visible" }}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">
          <i className="bx bx-fridge me-2"></i>
          {fridge.name}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>

      <div className="offcanvas-body">
        {/* Header Card */}
        <div className="card mb-4 border-0 bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="mb-1 fw-bold">{fridge.name}</h6>
                <small className="text-muted">
                  Code: <code>{fridge.code}</code>
                </small>
              </div>
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
            </div>

            <div className="progress mb-3" style={{ height: "24px" }}>
              <div
                className="progress-bar progress-bar-striped"
                role="progressbar"
                style={{
                  width: `${percent}%`,
                  backgroundColor: getPercentageColor(percent),
                }}
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span className="fw-bold small">{percent}%</span>
              </div>
            </div>

            <small className="text-muted d-block text-center">
              {fridge.sample_number} of {fridge.capacity} samples stored
            </small>
          </div>
        </div>

        {/* Main Information */}
        <div className="card mb-3 border-0 shadow-sm">
          <div className="card-header bg-light border-bottom">
            <h6 className="mb-0">
              <i className="bx bx-info-circle me-2"></i>
              General Information
            </h6>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-sm-6">
                <small className="text-muted d-block mb-1">Serial Number</small>
                <strong className="d-block">{fridge.serial_number}</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-muted d-block mb-1">Model</small>
                <strong className="d-block">{fridge.model}</strong>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6">
                <small className="text-muted d-block mb-1">Min Temperature</small>
                <strong className="d-block text-primary">{fridge.minimum_temperature}°C</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-muted d-block mb-1">Max Temperature</small>
                <strong className="d-block text-primary">{fridge.maximum_temperature}°C</strong>
              </div>
            </div>

            {fridge.description && (
              <div>
                <small className="text-muted d-block mb-1">Description</small>
                <p className="mb-0 text-break small">{fridge.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Storage Statistics */}
        <div className="card mb-3 border-0 shadow-sm">
          <div className="card-header bg-light border-bottom">
            <h6 className="mb-0">
              <i className="bx bx-stats me-2"></i>
              Storage Statistics
            </h6>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-6 mb-3">
                <div className="stat-box">
                  <div className="stat-value text-info fw-bold" style={{ fontSize: "1.5rem" }}>
                    {fridge.block_number}
                  </div>
                  <small className="text-muted d-block">Total Blocks</small>
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="stat-box">
                  <div className="stat-value text-warning fw-bold" style={{ fontSize: "1.5rem" }}>
                    {fridge.sample_number}
                  </div>
                  <small className="text-muted d-block">Samples Stored</small>
                </div>
              </div>
              <div className="col-6">
                <div className="stat-box">
                  <div className="stat-value text-success fw-bold" style={{ fontSize: "1.5rem" }}>
                    {fridge.capacity}
                  </div>
                  <small className="text-muted d-block">Total Capacity</small>
                </div>
              </div>
              <div className="col-6">
                <div className="stat-box">
                  <div className="stat-value fw-bold" style={{ fontSize: "1.5rem", color: getPercentageColor(percent) }}>
                    {percent}%
                  </div>
                  <small className="text-muted d-block">Utilization</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Info */}
        <div className="card mb-3 border-0 shadow-sm">
          <div className="card-header bg-light border-bottom">
            <h6 className="mb-0">
              <i className="bx bx-calendar me-2"></i>
              Registration Details
            </h6>
          </div>
          <div className="card-body">
            <small className="text-muted d-block mb-1">Created At</small>
            <strong className="d-block mb-3">
              {new Date(fridge.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}{" "}
              at{" "}
              {new Date(fridge.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>

            <small className="text-muted d-block mb-1">Status</small>
            <span className={`badge bg-label-${fridge.is_active ? "success" : "danger"}`}>
              {fridge.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              navigate(`/fridges/open/${fridge.uid}`);
            }}
          >
            <i className="bx bx-right-arrow-alt me-2"></i>
            View Full Details
          </button>

          <button className="btn btn-outline-warning" onClick={() => onEdit(fridge)}>
            <i className="bx bx-pencil me-2"></i>
            Edit Fridge
          </button>

          <button className="btn btn-outline-danger" onClick={() => onDelete(fridge)}>
            <i className="bx bx-trash me-2"></i>
            Delete Fridge
          </button>
        </div>
      </div>
    </div>
  );
};

export default FridgeDetailPanel;
