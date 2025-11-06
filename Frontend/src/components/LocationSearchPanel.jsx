import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const LocationSearchPanel = (props) => {
  const {
    activeField,
    origin,
    destination,
    handleSelect
  } = props

  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  const query =
    activeField === 'origin'
      ? origin
      : activeField === 'destination'
      ? destination
      : ''

  useEffect(() => {
    if (!activeField || !query || query.trim().length === 0) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}maps/get-suggestions`, {
          params: { input: query },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 5000
        })
        const data = res.data
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
      } catch (err) {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query, activeField])

  const staticLocations = [
    "White House PG, Sunder Nagar, Rajpura, Punjab 140401",
    "Green Villa, Model Town, Rajpura, Punjab 140401",
    "Blue Residency, Patel Nagar, Rajpura, Punjab 140401",
    "Sunrise Hostel, Urban Estate, Rajpura, Punjab 140401"
  ]

  const results = suggestions.length ? suggestions.map((s, i) => ({
    key: s.place_id || `suggest-${i}`,
    description: s.description
  })) : staticLocations.map((loc, i) => ({
    key: `static-${i}`,
    description: loc
  }))

  return (
    <div className="bg-white shadow-xl rounded-xl max-h-[60vh] overflow-y-auto border border-gray-200 mt-2 animate-fadeIn">
      {loading && (
        <div className="p-4 text-sm text-gray-500 italic">
          Loading suggestions...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="p-4 text-sm text-gray-400 italic text-center">
          No suggestions found
        </div>
      )}

      {results.map((item) => (
        <div
          key={item.key}
          onClick={() => handleSelect(item.description)}
          className="flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all duration-200 active:scale-[0.98]"
        >
         <div className="bg-blue-100 text-black h-8 w-8 flex items-center justify-center rounded-full">
  <i className="ri-map-pin-2-fill text-xl leading-none"></i>
</div>
          <div className="text-gray-700 text-sm sm:text-base font-medium">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LocationSearchPanel
