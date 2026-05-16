import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const options = { disableDefaultUI: true, zoomControl: true };

const LiveTrackingOngoing = ({
  origin,
  destination,
  rideId,
  receiveMessage,
  socket,
  offMessage,
}) => {
  const [directions, setDirections] = useState(null);
  const [captainPos, setCaptainPos] = useState(null);
  const mapRef = useRef(null);
  const routeDrawnOnce = useRef(false);

  // Safe coordinate conversion
  const safeOrigin = origin
    ? { lat: Number(origin.lat), lng: Number(origin.lon) }
    : null;

  const safeDestination = destination
    ? { lat: Number(destination.lat), lng: Number(destination.lon) }
    : null;

  // Draw directions helper
  const drawRoute = (from, to) => {
    if (!window.google || !from || !to) return;
    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: from,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (res, status) => status === "OK" && setDirections(res)
    );
  };

  // 🛣 Draw initial static route only once
  useEffect(() => {
    if (!safeOrigin || !safeDestination) return;
    if (routeDrawnOnce.current) return;

    console.log("🛣 Drawing static origin → destination");
    drawRoute(safeOrigin, safeDestination);
    routeDrawnOnce.current = true;
  }, [safeOrigin, safeDestination]);

  // 📡 Listen to captain's live GPS
  useEffect(() => {
    if (!socket || !receiveMessage || !rideId) return;

    const event = `location-update-${rideId}`;
    console.log(`🟢 Listening GPS event: ${event}`);

    const handler = (data) => {
      if (!data?.lat || !data?.lon) return;
      const newPos = { lat: Number(data.lat), lng: Number(data.lon) };

      console.log("📍 Live position received:", newPos);
      setCaptainPos(newPos);

      // ⏱️ dynamic redraw route (car → destination)
      drawRoute(newPos, safeDestination);

      // Follow car on map
      mapRef.current?.panTo(newPos);
    };

    receiveMessage(event, handler);

    return () => offMessage?.(event, handler);
  }, [socket, receiveMessage, rideId, safeDestination, offMessage]);

  if (!window.google) return <p>📍 Loading map…</p>;

  return (
    <GoogleMap
      onLoad={(m) => (mapRef.current = m)}
      mapContainerStyle={containerStyle}
      center={captainPos || safeOrigin}
      zoom={15}
      options={options}
    >
      {/* 🚗 Captain Live Icon */}
      {/* 🚗 Live Captain */}
{captainPos && (
  <Marker
    position={captainPos}
    icon={{
      url: "https://img.icons8.com/?size=100&id=EC624Rw9WKdA&format=png&color=000000",
      scaledSize: new window.google.maps.Size(45, 45),
      anchor: new window.google.maps.Point(22, 22),
    }}
  />
)}

{/* 📍 Pickup */}
{safeOrigin && (
  <Marker
    position={safeOrigin}
    icon={{
      url: "https://img.icons8.com/?size=100&id=KtUiBF6lEFel&format=png&color=000000",
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 40),
    }}
    optimized={false}
  />
)}

{/* 🏁 Destination */}
{safeDestination && (
  <Marker
    position={safeDestination}
    icon={{
      url: "https://img.icons8.com/?size=100&id=20844&format=png&color=000000",
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 40),
    }}
    optimized={false}
  />
)}

      {/* 🛣 Route Line */}
      {directions && (
  <DirectionsRenderer
    directions={directions}
    options={{
      suppressMarkers: true,
    }}
  />
)}
    </GoogleMap>
  );
};

export default LiveTrackingOngoing;
