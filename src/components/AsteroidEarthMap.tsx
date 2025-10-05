"use client";
import { type TFinalDataItem } from "../app/types";
import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface AsteroidEarthMapProps {
  data: TFinalDataItem;
}

interface CloseApproachPoint {
  latitude: number;
  longitude: number;
  date: string;
  missDistance: number;
  velocity: number;
}

/**
 * Calculate the sub-asteroid point (latitude/longitude where asteroid is directly overhead)
 */
function calculateSubAsteroidPoint(
  epochMs: number,
  asteroidData: TFinalDataItem,
): { latitude: number; longitude: number } {
  const date = new Date(epochMs);

  // Extract orbital elements
  const orbitalElements = asteroidData.nasa_jpl_data.orbit.elements;
  const inclination = parseFloat(
    orbitalElements.find((e) => e.name === "i")?.value || "0",
  );
  const longitudeOfNode = parseFloat(
    orbitalElements.find((e) => e.name === "om")?.value || "0",
  );

  // Calculate Julian Date
  const jd = epochMs / 86400000 + 2440587.5;

  // Greenwich Mean Sidereal Time
  const T = (jd - 2451545.0) / 36525;
  const gmst =
    (280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T -
      (T * T * T) / 38710000) %
    360;

  // Estimate right ascension from longitude of ascending node
  const rightAscension = longitudeOfNode;

  // Hour angle
  const hourAngle = gmst - rightAscension;

  // Longitude is derived from the hour angle
  let longitude = (hourAngle + 180) % 360;
  if (longitude > 180) longitude -= 360;

  // Declination approximation from inclination
  const declination =
    Math.sin((inclination * Math.PI) / 180) *
    Math.sin((date.getMonth() / 12) * 2 * Math.PI) *
    23.5;

  return {
    latitude: Math.max(-85, Math.min(85, declination)),
    longitude: longitude,
  };
}

// Fix for default marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function AsteroidEarthMap({ data }: AsteroidEarthMapProps) {
  const [selectedApproach, setSelectedApproach] = React.useState<number>(0);

  // Calculate close approach points
  // Get asteroid diameter (average of min and max)
  const asteroidRadiusMeters = React.useMemo(() => {
    const diameterMin = data.estimated_diameter.meters.estimated_diameter_min;
    const diameterMax = data.estimated_diameter.meters.estimated_diameter_max;
    const averageDiameter = (diameterMin + diameterMax) / 2;
    return averageDiameter / 2; // Convert diameter to radius
  }, [data]);

  const closeApproachPoints: CloseApproachPoint[] = React.useMemo(() => {
    if (!data.close_approach_data || data.close_approach_data.length === 0) {
      return [];
    }

    return data.close_approach_data.map((approach) => {
      const { latitude, longitude } = calculateSubAsteroidPoint(
        approach.epoch_date_close_approach,
        data,
      );

      return {
        latitude,
        longitude,
        date: approach.close_approach_date_full,
        missDistance: parseFloat(approach.miss_distance.kilometers),
        velocity: parseFloat(approach.relative_velocity.kilometers_per_second),
      };
    });
  }, [data]);

  const currentPoint = closeApproachPoints[selectedApproach];

  if (!currentPoint) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No close approach data available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Approach selector */}
      {closeApproachPoints.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {closeApproachPoints.map((point, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedApproach(idx)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedApproach === idx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {new Date(point.date).toLocaleDateString()}
            </button>
          ))}
        </div>
      )}

      {/* Leaflet Map */}
      <div className="h-60 rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[currentPoint.latitude, currentPoint.longitude]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
          key={`${currentPoint.latitude}-${currentPoint.longitude}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[currentPoint.latitude, currentPoint.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{data.name}</h3>
                <p className="text-sm mt-1">
                  <strong>Date:</strong>{" "}
                  {new Date(currentPoint.date).toLocaleString()}
                </p>
                <p className="text-sm">
                  <strong>Miss Distance:</strong>{" "}
                  {currentPoint.missDistance.toLocaleString()} km
                </p>
                <p className="text-sm">
                  <strong>Velocity:</strong> {currentPoint.velocity.toFixed(2)}{" "}
                  km/s
                </p>
                <p className="text-sm">
                  <strong>Coordinates:</strong>{" "}
                  {currentPoint.latitude.toFixed(2)}°,{" "}
                  {currentPoint.longitude.toFixed(2)}°
                </p>
                <p className="text-sm">
                  <strong>Asteroid Size:</strong>{" "}
                  {(asteroidRadiusMeters * 2).toFixed(0)} m diameter
                </p>
              </div>
            </Popup>
          </Marker>

          <Circle
            center={[currentPoint.latitude, currentPoint.longitude]}
            radius={asteroidRadiusMeters}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        </MapContainer>
      </div>
      <p className="text-sm italic">
        *Projection of an asteroid at its closest approach on Earth
      </p>
    </div>
  );
}
