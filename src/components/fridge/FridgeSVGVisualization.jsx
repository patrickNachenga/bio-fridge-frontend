import React, { useState } from "react";
import { motion } from "framer-motion";

const FridgeSVGVisualization = ({
  fridgeData,
  onBlockClick,
  interactive = true,
}) => {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  const blockVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
    },
  };

  const doorVariants = {
    closed: { rotateY: 0 },
    open: { rotateY: 10 },
  };

  const temperatureVariants = {
    normal: { color: "#667eea" },
    warning: { color: "#ff9800" },
    critical: { color: "#f44336" },
  };

  const getTemperatureStatus = () => {
    if (!fridgeData?.current_temperature) return "normal";
    const temp = parseFloat(fridgeData.current_temperature);
    const min = parseFloat(fridgeData.minimum_temperature || -20);
    const max = parseFloat(fridgeData.maximum_temperature || -10);

    if (temp < min || temp > max) return "critical";
    if (Math.abs(temp - min) < 2 || Math.abs(temp - max) < 2) return "warning";
    return "normal";
  };

  const capacityPercentage =
    fridgeData?.capacity > 0
      ? Math.round((fridgeData?.sample_number / fridgeData?.capacity) * 100)
      : 0;

  return (
    <div className="fridge-svg-container">
      <svg
        viewBox="0 0 600 700"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto" }}
      >
        {/* Background */}
        <rect width="600" height="700" fill="#f8f9fa" />

        {/* Fridge Body - Main Container */}
        <g id="fridge-body">
          {/* Outer Shell */}
          <rect
            x="80"
            y="50"
            width="440"
            height="550"
            rx="20"
            fill="#e0e0e0"
            stroke="#999"
            strokeWidth="2"
          />

          {/* Inner Fridge Area */}
          <rect
            x="100"
            y="80"
            width="400"
            height="480"
            rx="15"
            fill="#f5f5f5"
            stroke="#ddd"
            strokeWidth="1"
          />

          {/* Door Highlight (Glass Effect) */}
          <rect
            x="105"
            y="90"
            width="150"
            height="450"
            rx="10"
            fill="url(#glassGradient)"
            opacity="0.4"
          />

          {/* Temperature Display */}
          <rect
            x="320"
            y="100"
            width="160"
            height="80"
            rx="8"
            fill="white"
            stroke="#ddd"
            strokeWidth="1"
          />

          <text x="400" y="125" textAnchor="middle" fontSize="14" fontWeight="500" fill="#666">
            Current Temp
          </text>

          <text
            x="400"
            y="155"
            textAnchor="middle"
            fontSize="32"
            fontWeight="700"
            fill={getTemperatureStatus() === "critical" ? "#f44336" : "#667eea"}
          >
            {fridgeData?.current_temperature || "N/A"}°C
          </text>

          {/* Capacity Indicator */}
          <rect
            x="320"
            y="200"
            width="160"
            height="80"
            rx="8"
            fill="white"
            stroke="#ddd"
            strokeWidth="1"
          />

          <text x="400" y="225" textAnchor="middle" fontSize="14" fontWeight="500" fill="#666">
            Capacity
          </text>

          <text
            x="400"
            y="255"
            textAnchor="middle"
            fontSize="32"
            fontWeight="700"
            fill="#667eea"
          >
            {capacityPercentage}%
          </text>

          {/* Block Grid Representation */}
          <text x="120" y="320" fontSize="14" fontWeight="600" fill="#333">
            Blocks ({fridgeData?.block_number || 0})
          </text>

          {/* Blocks Grid */}
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = 120 + col * 90;
            const y = 340 + row * 70;
            const isHovered = hoveredBlock === index;

            return (
              <g
                key={`block-${index}`}
                onMouseEnter={() => setHoveredBlock(index)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => onBlockClick && onBlockClick(index)}
                style={{ cursor: interactive ? "pointer" : "default" }}
              >
                {/* Block Rectangle */}
                <rect
                  x={x}
                  y={y}
                  width="80"
                  height="60"
                  rx="6"
                  fill={isHovered ? "#667eea" : "#fff"}
                  stroke={isHovered ? "#764ba2" : "#ddd"}
                  strokeWidth={isHovered ? "2" : "1"}
                  style={{
                    transition: "all 0.3s ease",
                    filter: isHovered
                      ? "drop-shadow(0 4px 12px rgba(102, 126, 234, 0.4))"
                      : "none",
                  }}
                />

                {/* Block Label */}
                <text
                  x={x + 40}
                  y={y + 25}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill={isHovered ? "white" : "#333"}
                >
                  {`Block ${String.fromCharCode(65 + index)}`}
                </text>

                {/* Block Capacity */}
                <text
                  x={x + 40}
                  y={y + 45}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? "white" : "#666"}
                >
                  {index + 1}/{fridgeData?.block_number || 1}
                </text>
              </g>
            );
          })}
        </g>

        {/* Status Indicator */}
        <circle
          cx="520"
          cy="100"
          r="12"
          fill={
            fridgeData?.is_active
              ? "#4caf50"
              : fridgeData?.status === "ACTIVE"
                ? "#667eea"
                : "#f44336"
          }
          style={{
            filter:
              fridgeData?.is_active &&
              "drop-shadow(0 0 8px rgba(76, 175, 80, 0.6))",
          }}
        >
          <animate
            attributeName="r"
            values="12;15;12"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        <text
          x="520"
          y="135"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="#666"
        >
          {fridgeData?.is_active ? "Active" : "Inactive"}
        </text>

        {/* Defs for Gradients */}
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Info Panel Below SVG */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              Total Blocks
            </span>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#667eea",
              }}
            >
              {fridgeData?.block_number || 0}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              Samples Stored
            </span>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#764ba2",
              }}
            >
              {fridgeData?.sample_number || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FridgeSVGVisualization;
