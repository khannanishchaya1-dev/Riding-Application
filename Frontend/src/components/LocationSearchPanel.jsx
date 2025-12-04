import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const LocationSearchPanel = ({ activeField, origin, destination, handleSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const query =
    activeField === "origin"
      ? origin
      : activeField === "destination"
      ? destination
      : "";

  useEffect(() => {
    if (!activeField || !query.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}maps/get-suggestions`,
          {
            params: { input: query },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setSuggestions(Array.isArray(res.data.suggestions) ? res.data.suggestions : []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, activeField]);

  const staticLocations = [
    "White House PG, Sunder Nagar, Rajpura, Punjab 140401",
    "Green Villa, Model Town, Rajpura, Punjab 140401",
    "Blue Residency, Patel Nagar, Rajpura, Punjab 140401",
    "Sunrise Hostel, Urban Estate, Rajpura, Punjab 140401",
  ];

  const results = suggestions.length
    ? suggestions.map((s, i) => ({
        key: s.place_id || `suggest-${i}`,
        description: s.description,
      }))
    : staticLocations.map((loc, i) => ({
        key: `static-${i}`,
        description: loc,
      }));

  return (
    <div className="backdrop-blur-xl bg-white/70 border-t border-gray-300 max-h-[65vh] overflow-y-auto 
                    pt-4 px-2 rounded-t-3xl animate-fadeIn z-[60]">

      {/* Loading */}
      {loading && (
        <div className="py-4 text-gray-600 text-center">
          <i className="ri-loader-4-line animate-spin text-2xl text-[#E23744]"></i>
        </div>
      )}

      {/* No results */}
      {!loading && results.length === 0 && (
        <div className="py-5 text-gray-500 text-center italic tracking-wide">
          No suggestions found
        </div>
      )}

      {/* List */}
      {results.map((item) => (
        <div
          key={item.key}
          onClick={() => handleSelect(item.description)}
          className="flex items-center gap-4 px-4 py-4 cursor-pointer transition 
          hover:bg-gray-100 active:scale-[0.98] border-b border-gray-200"
        >
          {/* Icon */}
          <div className="h-11 w-11 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center">
            <i className="ri-map-pin-fill text-[#E23744] text-xl"></i>
          </div>

          {/* Text */}
          <div className="leading-tight text-black">
            <p className="text-[15px] font-medium">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
