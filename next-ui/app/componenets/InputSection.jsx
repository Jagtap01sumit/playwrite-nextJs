"use client";
import { useState } from "react";

export default function InputSection() {
  const [keyword, setKeyword] = useState("");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = keyword ? { keyword } : url ? { url } : null;

    if (!payload) {
      alert("Please enter either a keyword or a URL.");
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
      <div className="md:w-1/2 w-full h-1/2 md:h-full">
        <img
          src="https://w0.peakpx.com/wallpaper/14/258/HD-wallpaper-trees-sunset-sky-silhouette-clouds.jpg"
          alt="Placeholder"
          className="w-full h-full object-cover p-10 rounded-[20vw] sm:rounded[15vw] md:rounded-[4vw]"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 w-full p-6 flex flex-col justify-center gap-4 overflow-hidden"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Enter a Word:</span>
          <input
            type="text"
            placeholder="e.g., automation"
            className="border border-gray-300 p-2 rounded"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>

        <p className="text-center">OR</p>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Enter a URL:</span>
          <input
            type="url"
            placeholder="https://example.com"
            className="border border-gray-300 p-2 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
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
