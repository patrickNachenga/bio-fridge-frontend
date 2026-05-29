import React, { useState } from "react";

const TrayVisualization = ({ blockData, onTrayClick, interactive = true }) => {
  const [selectedTray, setSelectedTray] = useState(null);
  const [hoveredTray, setHoveredTray] = useState(null);

  // Create a grid of 10x10 for trays (adjustable)
  const ROWS = 10;
  const COLS = 10;
  const TOTAL_TRAYS = ROWS * COLS;

  const sampleCount = blockData?.sample_number || 0;
  const capacity = blockData?.capacity || TOTAL_TRAYS;

  // Distribute samples across trays
  const occupiedTrays = new Set();
  for (let i = 0; i < Math.min(sampleCount, TOTAL_TRAYS); i++) {
    occupiedTrays.add(i);
  }

  const handleTrayClick = (index) => {
    setSelectedTray(index);
    onTrayClick && onTrayClick(index);
  };

  return (
    <div className="tray-visualization">
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <h4 style={{ margin: 0, marginBottom: "0.5rem" }}>
          {blockData?.name || "Block Visualization"}
        </h4>
        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
          {sampleCount} / {capacity} positions filled
        </p>
      </div>

      {/* Capacity Bar */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            Capacity Usage
          </span>
          <span style={{ fontSize: "0.9rem", color: "#667eea", fontWeight: "600" }}>
            {Math.round((sampleCount / capacity) * 100)}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#e9ecef",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(sampleCount / capacity) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "10px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Tray Grid */}
      <div
        className="tray-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: "0.75rem",
          padding: "1.5rem",
          background: "#f8f9fa",
          borderRadius: "10px",
          marginBottom: "2rem",
        }}
      >
        {Array.from({ length: TOTAL_TRAYS }).map((_, index) => {
          const isOccupied = occupiedTrays.has(index);
          const isHovered = hoveredTray === index;
          const isSelected = selectedTray === index;

          return (
            <div
              key={`tray-${index}`}
              onClick={() => interactive && handleTrayClick(index)}
              onMouseEnter={() => setHoveredTray(index)}
              onMouseLeave={() => setHoveredTray(null)}
              className="tray-cell"
              style={{
                aspectRatio: "1",
                background: isOccupied
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#f8f9fa",
                border: `2px solid ${
                  isSelected
                    ? "#667eea"
                    : isHovered
                      ? "#667eea"
                      : isOccupied
                        ? "#764ba2"
                        : "#dee2e6"
                }`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                cursor: interactive ? "pointer" : "default",
                transition: "all 0.2s ease",
                transform:
                  isHovered || isSelected ? "scale(1.08)" : "scale(1)",
                boxShadow:
                  isHovered || isSelected
                    ? "0 4px 12px rgba(102, 126, 234, 0.4)"
                    : "none",
                color: isOccupied ? "white" : "#adb5bd",
              }}
            >
              <div style={{ textAlign: "center", fontSize: "0.7rem" }}>
                <div style={{ fontWeight: "700", lineHeight: "1.2" }}>
                  {isOccupied ? "✓" : ""}
                </div>
                <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sample Details Panel */}
      {selectedTray !== null && occupiedTrays.has(selectedTray) && (
        <div
          style={{
            padding: "1.5rem",
            background: "white",
            border: "2px solid #667eea",
            borderRadius: "10px",
            animation: "slideInUp 0.3s ease",
          }}
        >
          <h5 style={{ marginBottom: "1rem", color: "#667eea" }}>
            Tray {selectedTray + 1} Details
          </h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <span style={{ color: "#666", fontSize: "0.85rem" }}>
                Position
              </span>
              <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                {selectedTray + 1}
              </div>
            </div>
            <div>
              <span style={{ color: "#666", fontSize: "0.85rem" }}>Status</span>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.4rem 0.8rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginTop: "0.25rem",
                }}
              >
                Occupied
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "2rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "4px",
            }}
          />
          <span style={{ fontSize: "0.85rem", color: "#666" }}>Occupied</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "#f8f9fa",
              border: "2px solid #dee2e6",
              borderRadius: "4px",
            }}
          />
          <span style={{ fontSize: "0.85rem", color: "#666" }}>Empty</span>
        </div>
      </div>
    </div>
  );
};

export default TrayVisualization;
