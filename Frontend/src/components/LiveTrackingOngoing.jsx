import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const options = { disableDefaultUI: true, zoomControl: true };

const LiveTrackingOngoing = ({ origin, destination, rideId, receiveMessage, socket, offMessage }) => {
  const [directions, setDirections] = useState(null);
  const [captainPos, setCaptainPos] = useState(null);
  const mapRef = useRef(null);
  const routeDrawn = useRef(false);

  const safeOrigin = origin ? { lat: Number(origin.lat), lng: Number(origin.lon) } : null;
  const safeDestination = destination ? { lat: Number(destination.lat), lng: Number(destination.lon) } : null;

  const drawRoute = (from, to) => {
    if (!window.google || !from || !to) return;
    const service = new window.google.maps.DirectionsService();
    service.route(
      { origin: from, destination: to, travelMode: window.google.maps.TravelMode.DRIVING },
      (res, status) => status === "OK" && setDirections(res)
    );
  };

  useEffect(() => {
    if (!safeOrigin || !safeDestination) return;
    if (routeDrawn.current) return;
    console.log("🛣 Drawing initial origin → destination");
    drawRoute(safeOrigin, safeDestination);
    routeDrawn.current = true;
  }, [safeOrigin, safeDestination]);

  useEffect(() => {
    if (!socket || !receiveMessage || !rideId) return;

    const event = `location-update-${rideId}`;
    console.log(`🟢 USER listening GPS on: ${event}`);

    const handler = (data) => {
      console.log("📍 USER Received:", data);
      if (!data?.lat || !data?.lon) return;

      const newPos = { lat: Number(data.lat), lng: Number(data.lon) };
      setCaptainPos(newPos);
      drawRoute(newPos, safeDestination);
      mapRef.current?.panTo(newPos);
    };

    receiveMessage(event, handler);
    return () => offMessage?.(event, handler);
  }, []);

  if (!window.google) return <p>📍 Loading map…</p>;

  return (
    <GoogleMap
      onLoad={(map) => (mapRef.current = map)}
      mapContainerStyle={containerStyle}
      center={captainPos || safeOrigin}
      zoom={15}
      options={options}
    >
      {captainPos && (
        <Marker
          position={captainPos}
          icon={{
            url: "/car.png",
            scaledSize: new window.google.maps.Size(45, 45),
            anchor: new window.google.maps.Point(22, 22),
          }}
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default LiveTrackingOngoing;
