export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: "#00885c" }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
        <p className="font-medium" style={{ color: "#00885c" }}>
          Saving...
        </p>
      </div>
    </div>
  );
};

export function LoadingCustom() {
  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className="animate-spin h-10 w-10 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ color: "#00885c" }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
      </svg>
      <p className="font-medium" style={{ color: "#00885c" }}>
        Loading...
      </p>
    </div>
  );
}
