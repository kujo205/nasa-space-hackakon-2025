"use client";
import * as React from "react";
import {
  WMSTileLayer,
  LayersControl,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
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

// Earthquake Layer Component
function EarthquakeLayer() {
  const map = useMap();
  const [earthquakeLayer, setEarthquakeLayer] =
    React.useState<L.GeoJSON | null>(null);

  React.useEffect(() => {
    const loadEarthquakes = async () => {
      try {
        const response = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
        );
        const data = await response.json();

        // Remove existing layer if present
        if (earthquakeLayer) {
          map.removeLayer(earthquakeLayer);
        }

        // Color based on magnitude
        const getColor = (mag: number) => {
          return mag > 7
            ? "#800026"
            : mag > 6
              ? "#BD0026"
              : mag > 5
                ? "#E31A1C"
                : mag > 4
                  ? "#FC4E2A"
                  : mag > 3
                    ? "#FD8D3C"
                    : mag > 2
                      ? "#FEB24C"
                      : mag > 1
                        ? "#FED976"
                        : "#FFEDA0";
        };

        // Create GeoJSON layer
        const layer = L.geoJSON(data, {
          pointToLayer: (feature, latlng) => {
            const magnitude = feature.properties.mag;
            return L.circleMarker(latlng, {
              radius: magnitude * 3,
              fillColor: getColor(magnitude),
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.7,
            });
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;

            layer.bindPopup(`
              <div style="min-width: 180px;">
                <h3 style="margin: 0 0 8px 0; color: ${getColor(props.mag)};">
                  Magnitude ${props.mag}
                </h3>
                <p style="margin: 4px 0;"><strong>Location:</strong> ${props.place}</p>
                <p style="margin: 4px 0;"><strong>Depth:</strong> ${coords[2].toFixed(2)} km</p>
                <p style="margin: 4px 0;"><strong>Time:</strong> ${new Date(props.time).toLocaleString()}</p>
                <a href="${props.url}" target="_blank" style="color: #0066cc; font-size: 12px;">More details →</a>
              </div>
            `);

            layer.bindTooltip(`M${props.mag} - ${props.place}`, {
              permanent: false,
              direction: "top",
            });
          },
        }).addTo(map);

        setEarthquakeLayer(layer);
      } catch (error) {
        console.error("Error loading earthquake data:", error);
      }
    };

    loadEarthquakes();

    // Cleanup
    return () => {
      if (earthquakeLayer) {
        map.removeLayer(earthquakeLayer);
      }
    };
  }, [map]);

  return null;
}

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
        {/* Layer Control */}
        <LayersControl position="topright" collapsed={false}>
          {/* ============ BASE LAYERS ============ */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="USGS Topographic">
            <WMSTileLayer
              attribution="USGS"
              url="https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer"
              layers="0"
              format="image/png"
              transparent={false}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="USGS Imagery">
            <WMSTileLayer
              attribution="USGS"
              url="https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer"
              layers="0"
              format="image/png"
              transparent={false}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="USGS Imagery + Topo">
            <WMSTileLayer
              attribution="USGS"
              url="https://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WMSServer"
              layers="0"
              format="image/png"
              transparent={false}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite (Esri)">
            <TileLayer
              attribution="Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="USGS Hydrography">
            <WMSTileLayer
              attribution="USGS"
              url="https://basemap.nationalmap.gov/arcgis/services/USGSHydroCached/MapServer/WMSServer"
              layers="0"
              format="image/png"
              transparent={true}
              opacity={0.7}
            />
          </LayersControl.Overlay>

          {/* ============ ASTEROID MARKER ============ */}
          <LayersControl.Overlay checked name="Asteroid Position">
            <Marker
              position={[currentPoint.latitude, currentPoint.longitude]}
              icon={customIcon}
            ></Marker>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
