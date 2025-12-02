import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const LocationSearchPanel = (props) => {
  const { activeField, origin, destination, handleSelect } = props;

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
            timeout: 5000,
          }
        );

        setSuggestions(Array.isArray(res.data.suggestions) ? res.data.suggestions : []);
      } catch (err) {
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
    <div className="bg-white shadow-2xl rounded-3xl max-h-[65vh] overflow-y-auto border-t-4 border-[#E23744] py-2 animate-fadeIn">

      {/* Loading */}
      {loading && (
        <div className="p-4 text-gray-500 text-center italic text-base">
          <i className="ri-loader-4-line animate-spin text-xl text-[#E23744]"></i>
        </div>
      )}

      {/* No results */}
      {!loading && results.length === 0 && (
        <div className="p-5 text-gray-400 text-center italic">
          No suggestions found
        </div>
      )}

      {/* Suggestions List */}
      {results.map((item) => (
        <div
          key={item.key}
          onClick={() => handleSelect(item.description)}
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#FFF5F5] active:scale-[0.98] transition-all duration-200 border-b border-gray-100"
        >
          {/* Icon Circle */}
          <div className="bg-[#FFE7E7] text-[#E23744] h-10 w-10 rounded-2xl flex items-center justify-center shadow-sm">
            <i className="ri-map-pin-2-fill text-xl"></i>
          </div>

          {/* Text */}
          <div className="text-gray-800 font-semibold leading-tight">
            <p className="text-[15px]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
