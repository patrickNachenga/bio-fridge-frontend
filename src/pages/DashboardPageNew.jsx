import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import FridgeSVGVisualization from "../components/fridge/FridgeSVGVisualization";
import ReactLoading from "react-loading";

export const DashboardPageNew = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer?.data);
  const [loading, setLoading] = useState(true);
  const [fridges, setFridges] = useState([]);
  const [stats, setStats] = useState({
    totalFridges: 0,
    totalSamples: 0,
    activeFridges: 0,
    totalCapacity: 0,
  });

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => {
      setFridges([
        {
          uid: "1",
          name: "Fridge A",
          code: "FG001",
          current_temperature: -20,
          minimum_temperature: -25,
          maximum_temperature: -15,
          block_number: 6,
          sample_number: 45,
          capacity: 100,
          is_active: true,
          status: "ACTIVE",
        },
        {
          uid: "2",
          name: "Fridge B",
          code: "FG002",
          current_temperature: -18,
          minimum_temperature: -25,
          maximum_temperature: -15,
          block_number: 4,
          sample_number: 32,
          capacity: 80,
          is_active: true,
          status: "ACTIVE",
        },
        {
          uid: "3",
          name: "Fridge C",
          code: "FG003",
          current_temperature: -22,
          minimum_temperature: -25,
          maximum_temperature: -15,
          block_number: 8,
          sample_number: 78,
          capacity: 120,
          is_active: true,
          status: "ACTIVE",
        },
      ]);

      setStats({
        totalFridges: 10,
        totalSamples: 155,
        activeFridges: 8,
        totalCapacity: 300,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const getPercentageColor = (percentage) => {
    if (percentage <= 25) return "#4caf50";
    if (percentage <= 50) return "#8bc34a";
    if (percentage <= 75) return "#ffc107";
    return "#f44336";
  };

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem" }}>
            Welcome back, {user?.first_name || "User"}!
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "1rem" }}>
            Here's your fridge management overview
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Total Fridges",
            value: stats.totalFridges,
            icon: "bx-cube",
            color: "#667eea",
          },
          {
            label: "Active Fridges",
            value: stats.activeFridges,
            icon: "bx-check-circle",
            color: "#4caf50",
          },
          {
            label: "Total Samples",
            value: stats.totalSamples,
            icon: "bx-test-tube",
            color: "#764ba2",
          },
          {
            label: "Total Capacity",
            value: stats.totalCapacity,
            icon: "bx-inbox",
            color: "#ff9800",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="stats-card"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <span className="stat-label">{stat.label}</span>
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
              <div className="stat-icon" style={{ background: stat.color }}>
                <i className={`bx ${stat.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Section */}
      <div className="fridge-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ margin: 0, color: "#333" }}>Active Fridges Overview</h3>
          <button
            onClick={() => navigate("/fridges")}
            className="btn btn-primary"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
              color: "white",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            View All Fridges
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <ReactLoading
              type="cylon"
              color="#667eea"
              height="50px"
              width="80px"
            />
            <p style={{ marginTop: "1rem", color: "#666" }}>
              Loading fridge data...
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(380px, 1fr))",
              gap: "2rem",
            }}
          >
            {fridges.map((fridge, index) => (
              <div
                key={fridge.uid}
                className="fridge-card"
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
                onClick={() => navigate(`/fridges/open/${fridge.uid}`)}
              >
                <div className="fridge-card-header">
                  <div>
                    <h4 className="fridge-card-title">{fridge.name}</h4>
                    <small style={{ color: "#999" }}>Code: {fridge.code}</small>
                  </div>
                  <div
                    className="fridge-card-status"
                    style={{
                      background: fridge.is_active
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "#f44336",
                      color: "white",
                    }}
                  >
                    {fridge.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <FridgeSVGVisualization
                  fridgeData={fridge}
                  interactive={false}
                />

                <div className="fridge-card-body" style={{ marginTop: "1.5rem" }}>
                  <div className="fridge-info-row">
                    <span className="fridge-info-label">Temperature</span>
                    <span
                      className="fridge-info-value"
                      style={{ color: "#667eea" }}
                    >
                      {fridge.current_temperature}°C
                    </span>
                  </div>

                  <div className="fridge-info-row">
                    <span className="fridge-info-label">Blocks</span>
                    <span className="fridge-info-value">
                      {fridge.block_number}
                    </span>
                  </div>

                  <div className="fridge-info-row">
                    <span className="fridge-info-label">Samples Stored</span>
                    <span className="fridge-info-value">
                      {fridge.sample_number} / {fridge.capacity}
                    </span>
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    <div className="capacity-bar">
                      <div
                        className="capacity-fill"
                        style={{
                          width: `${
                            fridge.capacity > 0
                              ? (fridge.sample_number / fridge.capacity) *
                                100
                              : 0
                          }%`,
                          background: getPercentageColor(
                            fridge.capacity > 0
                              ? (fridge.sample_number / fridge.capacity) *
                                100
                              : 0
                          ),
                        }}
                      />
                    </div>
                    <small style={{ color: "#999", fontSize: "0.8rem" }}>
                      {fridge.capacity > 0
                        ? (
                            (fridge.sample_number / fridge.capacity) *
                            100
                          ).toFixed(1)
                        : 0}
                      % capacity used
                    </small>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/fridges/open/${fridge.uid}`);
                  }}
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          marginTop: "3rem",
          padding: "2rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>Quick Actions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => navigate("/fridges")}
            style={{
              padding: "1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <i className="bx bx-cube me-2"></i> Manage Fridges
          </button>
          <button
            onClick={() => navigate("/samples/types")}
            style={{
              padding: "1rem",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <i className="bx bx-test-tube me-2"></i> Sample Types
          </button>
          <button
            onClick={() => navigate("/requests")}
            style={{
              padding: "1rem",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            <i className="bx bx-list-check me-2"></i> View Requests
          </button>
        </div>
      </div>
    </div>
  );
};
