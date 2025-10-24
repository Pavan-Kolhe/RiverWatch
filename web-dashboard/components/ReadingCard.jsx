import { Card, CardContent } from "@/components/ui/card"; // Fixed lowercase
import { getPhotoUrl } from "@/lib/appwrite";
import { MapPin, Calendar, User } from "lucide-react";

export default function ReadingCard({ reading }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Photo */}
          <img
            src={getPhotoUrl(reading.photoId)}
            alt="Gauge reading"
            className="w-24 h-24 object-cover rounded-lg"
          />

          {/* Details */}
          <div className="flex-1">
            <h3 className="font-bold text-lg">{reading.siteName}</h3>
            <p className="text-sm text-gray-600">ID: {reading.siteId}</p>

            <div className="mt-2">
              <span className="text-3xl font-bold text-blue-600">
                {reading.waterLevel.toFixed(2)}
              </span>
              <span className="text-gray-600 ml-1">meters</span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(reading.$createdAt).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {reading.latitude.toFixed(4)}°, {reading.longitude.toFixed(4)}°
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {reading.submittedBy}
              </div>
            </div>

            <div className="mt-2">
              {reading.isVerified ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  ✓ Verified ({reading.distanceFromSite.toFixed(0)}m from site)
                </span>
              ) : (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  ⚠ Location Mismatch ({reading.distanceFromSite.toFixed(0)}m
                  from site)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
