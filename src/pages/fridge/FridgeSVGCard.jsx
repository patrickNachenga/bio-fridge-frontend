import React from "react";
import { getPercentageColor } from "../../helpers/PercentageColorHelper";

const FridgeSVGCard = ({ fridge, onClick, showDetails = true }) => {
  const percent = fridge.capacity <= 0 ? 0 : ((fridge.sample_number / fridge.capacity) * 100).toFixed(2);
  const color = getPercentageColor(percent);

  return (
    <div
      className="card h-100 cursor-pointer transition-all"
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      }}
    >
      <div className="card-body">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width={200}
          height={180}
          fill="none"
          viewBox="0 0 200 180"
          style={{ margin: "0 auto", display: "block" }}
        >
          <defs>
            <linearGradient id={`grad-${fridge.uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Fridge Body */}
          <rect width={150} height={140} x={25} y={15} fill="#E8E8E8" rx={8} />

          {/* Status Indicator */}
          <circle cx={170} cy={30} r={12} fill={color} />
          <circle cx={170} cy={30} r={10} fill={color} opacity="0.3" />

          {/* Capacity Bar */}
          <rect width={140} height={6} x={30} y={50} fill="#DDD" rx={3} />
          <rect
            width={(140 * percent) / 100}
            height={6}
            x={30}
            y={50}
            fill={`url(#grad-${fridge.uid})`}
            rx={3}
          />

          {/* Stats */}
          <text x={100} y={75} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
            {percent}%
          </text>

          {/* Block Info */}
          <rect width={60} height={24} x={20} y={90} fill="#F5F5F5" rx={4} />
          <text x={50} y={107} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#666">
            Blocks: {fridge.block_number}
          </text>

          {/* Sample Info */}
          <rect width={60} height={24} x={90} y={90} fill="#F5F5F5" rx={4} />
          <text x={120} y={107} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#666">
            Samples: {fridge.sample_number}
          </text>

          {/* Capacity Info */}
          <rect width={130} height={24} x={35} y={125} fill="#F5F5F5" rx={4} />
          <text x={100} y={142} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#666">
            Capacity: {fridge.sample_number} / {fridge.capacity}
          </text>
        </svg>

        {showDetails && (
          <div className="mt-3 pt-3 border-top">
            <h6 className="fw-bold mb-2">{fridge.name}</h6>
            <small className="text-muted d-block">Code: {fridge.code}</small>
            <small className="text-muted d-block">Serial: {fridge.serial_number}</small>
            <div className="mt-2">
              <span className={`badge bg-label-${fridge.is_active ? "success" : "danger"}`}>
                {fridge.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FridgeSVGCard;
