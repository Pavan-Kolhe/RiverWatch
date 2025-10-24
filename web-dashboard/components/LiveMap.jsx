"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getAllReadings, getPhotoUrl } from "@/lib/appwrite";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LiveMap() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadings();

    // Real-time updates every 30 seconds
    const interval = setInterval(loadReadings, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadReadings() {
    try {
      const data = await getAllReadings(50);

      // Group by site (get latest reading per site)
      const latestBySite = {};
      data.forEach((reading) => {
        if (
          !latestBySite[reading.siteId] ||
          new Date(reading.$createdAt) >
            new Date(latestBySite[reading.siteId].$createdAt)
        ) {
          latestBySite[reading.siteId] = reading;
        }
      });

      setReadings(Object.values(latestBySite));
      setLoading(false);
    } catch (error) {
      console.error("Error loading readings:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Center of India
      zoom={5}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {readings.map((reading) => (
        <Marker
          key={reading.$id}
          position={[reading.latitude, reading.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{reading.siteName}</h3>
              <p className="text-sm text-gray-600">Site ID: {reading.siteId}</p>

              <div className="mt-2">
                <p className="text-2xl font-bold text-blue-600">
                  {reading.waterLevel.toFixed(2)} m
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(reading.$createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-2">
                <img
                  src={getPhotoUrl(reading.photoId)}
                  alt="Gauge"
                  className="w-full h-32 object-cover rounded"
                />
              </div>

              <div className="mt-2 flex items-center gap-2">
                {reading.isVerified ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    ⚠ Unverified
                  </span>
                )}
                <span className="text-xs text-gray-600">
                  {reading.distanceFromSite.toFixed(0)}m from site
                </span>
              </div>

              <a
                href={`/site/${reading.siteId}`}
                className="mt-2 block text-center text-sm text-blue-600 hover:underline"
              >
                View Details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
