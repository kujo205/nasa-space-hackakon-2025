import React, { useRef } from "react";

// Option 1: Orbital Ring Spinner
export function BasicLoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTop: "4px solid #4a9eff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
