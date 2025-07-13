"use client";
import React from "react";

export default function LoadingButton({
  loading = false,
  type = "button",
  onClick,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 py-2 px-4 rounded text-white transition w-full ${
        loading
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-600"
      } ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading ? "Loading..." : children}
    </button>
  );
}
