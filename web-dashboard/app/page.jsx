"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Fixed path
import ReadingCard from "@/components/ReadingCard";
import { getAllReadings, getAlerts } from "@/lib/appwrite";
import { Droplet, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export default function Dashboard() {
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    alerts: 0,
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [readingsData, alertsData] = await Promise.all([
        getAllReadings(20),
        getAlerts(),
      ]);

      setReadings(readingsData);
      setAlerts(alertsData);

      setStats({
        total: readingsData.length,
        verified: readingsData.filter((r) => r.isVerified).length,
        pending: readingsData.filter((r) => !r.isVerified).length,
        alerts: alertsData.length,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Live Monitoring Dashboard</h1>
        <p className="text-gray-600">
          Real-time water level data from field sites
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Readings</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Droplet className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.verified}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.alerts}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monitoring Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <LiveMap />
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readings List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Readings</h2>
          <div className="space-y-4">
            {readings.slice(0, 10).map((reading) => (
              <ReadingCard key={reading.$id} reading={reading} />
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Active Alerts
          </h2>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                No alerts. All systems normal.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.$id} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-red-800">{alert.siteName}</h3>
                    <p className="text-sm text-red-600">
                      ⚠ Location verification failed
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Distance from site: {alert.distanceFromSite.toFixed(0)}m
                      (max: 100m)
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.$createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
