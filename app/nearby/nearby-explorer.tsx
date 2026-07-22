"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Location } from "../../lib/mobilenom";

const NearbyMap = dynamic(() => import("./nearby-map"), { ssr: false });

const fallback = { latitude: 40.4406, longitude: -79.9959 };
const day = (value: string) => new Intl.DateTimeFormat(
  "en-US",
  { weekday: "short", month: "short", day: "numeric" },
).format(new Date(value));
const hours = (start: string, end: string) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
};

export default function NearbyExplorer() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [status, setStatus] = useState("Finding food near Pittsburgh…");
  const [selected, setSelected] = useState(0);

  const load = useCallback(async (coords: typeof fallback) => {
    setStatus("Looking for food trucks…");

    try {
      const response = await fetch(
        `/api/nearby?latitude=${coords.latitude}&longitude=${coords.longitude}`,
      );
      const data = await response.json();

      setLocations(data.locations ?? []);
      setStatus(
        data.locations?.length
          ? `${data.locations.length} stops found near you`
          : "No trucks found in this area yet",
      );
    } catch {
      setStatus("We couldn’t load nearby trucks. Please try again.");
    }
  }, []);

  useEffect(() => {
    const request = window.setTimeout(() => {
      void load(fallback);
    }, 0);

    return () => window.clearTimeout(request);
  }, [load]);

  const useLocation = () => navigator.geolocation?.getCurrentPosition(
    ({ coords }) => {
      void load({ latitude: coords.latitude, longitude: coords.longitude });
    },
    () => setStatus("Location access is off. Showing Pittsburgh-area trucks."),
  );
  const mapLocations = useMemo(() => locations.slice(0, 12), [locations]);

  return (
    <section className="nearby shell">
      <div className="nearby-heading">
        <div>
          <p className="eyebrow"><i /> Food trucks near you</p>
          <h1>What&apos;s cooking <em>nearby?</em></h1>
          <p className="nearby-status">{status}</p>
        </div>
        <button className="locate-button" onClick={useLocation}>
          ⌖ Use my location
        </button>
      </div>
      <div className="explorer">
        <aside className="truck-list">
          <div className="list-label">Upcoming stops</div>
          {locations.slice(0, 12).map((location, index) => (
            <button
              className={`truck-stop ${selected === index ? "is-selected" : ""}`}
              key={location.id}
              onClick={() => setSelected(index)}
            >
              <div className="stop-date">
                <b>{day(location.startsAt)}</b>
                <span>{hours(location.startsAt, location.expiresAt)}</span>
              </div>
              <div>
                <strong>{location.trucks[0]?.name ?? "Food truck"}</strong>
                <span>{location.landmark || location.formattedAddress}</span>
                <small>
                  {location.distance
                    ? `${location.distance.toFixed(1)} mi away`
                    : location.isActive ? "Open now" : "Scheduled"}
                </small>
              </div>
              <span className="chevron">→</span>
            </button>
          ))}
          {!locations.length && <div className="empty">Loading the latest schedule…</div>}
        </aside>
        <div className="map-canvas">
          <NearbyMap
            locations={mapLocations}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>
    </section>
  );
}
