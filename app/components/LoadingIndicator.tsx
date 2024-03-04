export const LoadingIndicator = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      margin: "auto",
      background: "none",
      display: "block",
      shapeRendering: "auto",
    }}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="#3498db"
      strokeWidth="4"
      strokeDasharray="31.415, 31.415"
      strokeLinecap="round"
      style={{
        transformOrigin: "center",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
    </style>
  </svg>
);
