"use client";

import type { CircleMarker as LeafletCircleMarker } from "leaflet";
import { useEffect, useRef, type RefObject } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { Location } from "../../lib/mobilenom";

type NearbyMapProps = {
  locations: Location[];
  selected: number;
  onSelect: (index: number) => void;
};

function FitToLocations({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    const points = locations
      .map((location): [number, number] => [
        Number(location.latitude),
        Number(location.longitude),
      ])
      .filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude));

    if (points.length === 1) {
      map.setView(points[0], 13);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [45, 45], maxZoom: 13 });
    }
  }, [locations, map]);

  return null;
}

function ActivateSelectedStop({
  location,
  markers,
}: {
  location: Location | undefined;
  markers: RefObject<Record<number, LeafletCircleMarker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    const marker = location ? markers.current[location.id] : null;

    if (!location || !marker) return;

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 12), {
      duration: 0.45,
    });
    marker.openPopup();
  }, [location, map, markers]);

  return null;
}

export default function NearbyMap({
  locations,
  selected,
  onSelect,
}: NearbyMapProps) {
  const markers = useRef<Record<number, LeafletCircleMarker | null>>({});
  const selectedLocation = locations[selected];

  return (
    <div className="nearby-map">
      <MapContainer
        center={[40.4406, -79.9959]}
        zoom={11}
        scrollWheelZoom
        aria-label="Map of nearby food truck stops"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToLocations locations={locations} />
        <ActivateSelectedStop
          location={selectedLocation}
          markers={markers}
        />
        {locations.map((location, index) => {
          const latitude = Number(location.latitude);
          const longitude = Number(location.longitude);

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

          const truck = location.trucks[0];
          const isSelected = index === selected;

          return (
            <CircleMarker
              center={[latitude, longitude]}
              eventHandlers={{ click: () => onSelect(index) }}
              key={location.id}
              ref={(marker) => {
                markers.current[location.id] = marker;
              }}
              pathOptions={{
                color: "#ffffff",
                fillColor: isSelected ? "#19352c" : "#f15a35",
                fillOpacity: 1,
                weight: isSelected ? 4 : 3,
              }}
              radius={isSelected ? 13 : 10}
            >
              <Popup>
                <p className="map-popup-label">
                  {location.isActive ? "OPEN NOW" : "UPCOMING STOP"}
                </p>
                <strong className="map-popup-name">{truck?.name ?? "Food truck"}</strong>
                <span className="map-popup-location">
                  {location.landmark || location.formattedAddress}
                </span>
                {truck?.handle && <a className="map-popup-link" href={`/${truck.handle}`}>View truck →</a>}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
