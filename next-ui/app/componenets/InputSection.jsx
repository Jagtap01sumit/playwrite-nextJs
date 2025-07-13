"use client";
import { useState } from "react";
import img from "@/app/images/image.png";
import Image from "next/image";
export default function InputSection() {
  const [useKeyword, setUseKeyword] = useState(true); // true = keyword, false = URL
  const [keyword, setKeyword] = useState("");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      useKeyword && keyword ? { keyword } : !useKeyword && url ? { url } : null;

    if (!payload) {
      alert("Please enter the selected input.");
      return;
    }

    const res = await fetch("/api/send-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
      <div className="md:w-1/2 w-full h-screen md:h-auto ">
        <Image
          src={img}
          alt="Placeholder"
          className=" object-contain p-10 pb-400"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 w-full p-6 flex flex-col justify-center gap-4 overflow-hidden"
      >
        {/* Toggle Switch */}
        <div className="flex items-center gap-4">
          <span className="text-sm">Keyword</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!useKeyword}
              onChange={() => setUseKeyword((prev) => !prev)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
            <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
          </label>
          <span className="text-sm">URL</span>
        </div>

        {/* Keyword Input */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Enter a Word:</span>
          <input
            type="text"
            placeholder="e.g., automation"
            className={`border p-2 rounded ${
              !useKeyword
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "border-gray-300"
            }`}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={!useKeyword}
          />
        </label>

        {/* URL Input */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Enter a URL:</span>
          <input
            type="url"
            placeholder="https://example.com"
            className={`border p-2 rounded ${
              useKeyword
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "border-gray-300"
            }`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={useKeyword}
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Submit
        </button>

        {response && (
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </form>
    </main>
  );
}
