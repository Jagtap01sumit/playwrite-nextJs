"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, ShieldCheck, Globe, Clock, Link2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureSection() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch("/data/infoData.json") // ✅ loads directly from public folder
      .then((res) => res.json())
      .then(setInfo)
      .catch((err) => console.error("Failed to load JSON:", err));
  }, []);

  if (!info)
    return <p className="text-center text-gray-400">Loading report...</p>;

  return (
    <section className="bg-gradient-to-br from-white to-slate-100 py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-800">{info.title}</h2>
        <p className="mt-3 text-gray-600 text-lg">
          Here’s a detailed summary of your latest website health scan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {info.features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-left border border-gray-200"
          >
            <div className="flex items-center mb-3">
              {getIcon(feature.label)}
              <h3 className="ml-3 font-semibold text-gray-700 text-lg">
                {feature.label}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-snug">
              {feature.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// 🔍 Dynamically choose icon based on label
function getIcon(label) {
  const lower = label.toLowerCase();
  if (lower.includes("ssl"))
    return <ShieldCheck className="text-blue-600 w-5 h-5" />;
  if (lower.includes("url"))
    return <Globe className="text-indigo-500 w-5 h-5" />;
  if (lower.includes("status") || lower.includes("responsive"))
    return <CheckCircle className="text-green-500 w-5 h-5" />;
  if (lower.includes("load"))
    return <Clock className="text-yellow-500 w-5 h-5" />;
  if (lower.includes("link") || lower.includes("canonical"))
    return <Link2 className="text-purple-500 w-5 h-5" />;
  return <CheckCircle className="text-gray-500 w-5 h-5" />;
}
