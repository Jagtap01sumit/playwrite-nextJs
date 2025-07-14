"use client";
import { useState } from "react";
import img from "@/app/images/image.png";
import Image from "next/image";
import LoadingButton from "./LoadingButton";
export default function InputSection() {
  const [useKeyword, setUseKeyword] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload =
      useKeyword && keyword ? { keyword } : !useKeyword && url ? { url } : null;

    if (!payload) {
      alert("Please enter the selected input.");
      setLoading(false);
      return;
    }

    try {
      console.log("this is before url111111");
      const res = await fetch("/api/send-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("this is before url");
      const data = await res.json();
      setResponse(data);
      console.log(data.downloadUrl, "this is url");
      if (data.downloadUrl) {
        console.log(data.downloadUrl, "url");
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = data.fileUrl || "report.html";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log("something went wrong");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setClearing(true);
    setTimeout(() => {
      setResponse(null);
      setClearing(false);
      setUrl("");
      setKeyword("");
    }, 300);
  };

  return (
    <main className="flex flex-col md:flex-row flex-1">
      <div className="md:w-1/2 w-full h-4/9 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300 w-full h-[70%]">
          <Image src={img} alt="Placeholder" className="h-8/9 w-full" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 w-full p-6 justify-center gap-4 flex flex-col"
      >
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

        <LoadingButton type="submit" loading={loading}>
          Submit
        </LoadingButton>

        {response && (
          <div>
            <div
              className={`mt-4 bg-gray-100 p-4 rounded transition-opacity duration-300 ${
                clearing ? "opacity-0" : "opacity-100"
              }`}
            >
              <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
            </div>
            <LoadingButton onClick={handleClear}>Clear</LoadingButton>
          </div>
        )}
      </form>
    </main>
  );
}
