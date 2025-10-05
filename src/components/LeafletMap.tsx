"use client";
import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { type TFinalDataItem } from "../app/types";

interface LeafletMapProps {
  currentPoint: {
    latitude: number;
    longitude: number;
    date: string;
    missDistance: number;
    velocity: number;
  };
  data: TFinalDataItem;
  asteroidRadiusMeters: number;
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

export function LeafletMap({
  currentPoint,
  data,
  asteroidRadiusMeters,
}: LeafletMapProps) {
  return (
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
                <strong>Coordinates:</strong> {currentPoint.latitude.toFixed(2)}
                °, {currentPoint.longitude.toFixed(2)}°
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
  );
}
