"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getReadingsBySite, getPhotoUrl } from "@/lib/appwrite";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.id;
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSiteData();
  }, [siteId]);

  async function loadSiteData() {
    try {
      const data = await getReadingsBySite(siteId, 7);
      setReadings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading site data:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (readings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        No data found for this site.
      </div>
    );
  }

  const latestReading = readings[0];

  // Prepare chart data
  const chartData = readings.reverse().map((r) => ({
    time: new Date(r.$createdAt).toLocaleDateString(),
    level: r.waterLevel,
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2">{latestReading.siteName}</h1>
      <p className="text-gray-600 mb-8">Site ID: {latestReading.siteId}</p>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {latestReading.waterLevel.toFixed(2)} m
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Last updated:{" "}
              {new Date(latestReading.$createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Lat: {latestReading.latitude.toFixed(6)}°</p>
            <p className="text-sm">
              Long: {latestReading.longitude.toFixed(6)}°
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Accuracy: {latestReading.distanceFromSite.toFixed(0)}m from site
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            {latestReading.isVerified ? (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-semibold">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-600 font-semibold">Unverified</span>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Submitted by: {latestReading.submittedBy}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>7-Day Water Level Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis
                label={{
                  value: "Water Level (m)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="level"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {readings.slice(0, 8).map((reading) => (
              <div key={reading.$id} className="space-y-2">
                <img
                  src={getPhotoUrl(reading.photoId)}
                  alt="Gauge reading"
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <div className="text-xs text-center">
                  <p className="font-semibold">
                    {reading.waterLevel.toFixed(2)} m
                  </p>
                  <p className="text-gray-600">
                    {new Date(reading.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date & Time</th>
                  <th className="text-left py-2">Water Level</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Distance</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Photo</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((reading) => (
                  <tr key={reading.$id} className="border-b hover:bg-gray-50">
                    <td className="py-2">
                      {new Date(reading.$createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 font-semibold">
                      {reading.waterLevel.toFixed(2)} m
                    </td>
                    <td className="py-2 text-xs">
                      {reading.latitude.toFixed(4)}°,{" "}
                      {reading.longitude.toFixed(4)}°
                    </td>
                    <td className="py-2">
                      {reading.distanceFromSite.toFixed(0)}m
                    </td>
                    <td className="py-2">
                      {reading.isVerified ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          ✗
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <a
                        href={getPhotoUrl(reading.photoId)}
                        target="_blank"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
