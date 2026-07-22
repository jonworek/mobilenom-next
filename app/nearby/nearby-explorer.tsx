"use client";

import Image from "next/image";
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

const isSameDay = (first: Date, second: Date) => (
  first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate()
);

const groupLabel = (location: Location, now: Date) => {
  if (location.isActive) return "Open now";

  const start = new Date(location.startsAt);

  if (isSameDay(start, now)) return "Open later today";

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  return isSameDay(start, tomorrow) ? "Tomorrow" : day(location.startsAt);
};

type VisibleLocation = { location: Location; index: number };

function StopListItem({
  item,
  isSelected,
  onSelect,
}: {
  item: VisibleLocation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { location } = item;
  const truck = location.trucks[0];

  return (
    <button
      className={`truck-stop ${isSelected ? "is-selected" : ""}`}
      onClick={onSelect}
    >
      <div className="truck-thumbnail">
        {truck?.imageUrl ? (
          <Image
            src={truck.imageUrl}
            alt=""
            fill
            sizes="72px"
            unoptimized
          />
        ) : <span aria-hidden="true">🍽</span>}
      </div>
      <div className="stop-details">
        <strong>{truck?.name ?? "Food truck"}</strong>
        <span>{location.landmark || location.formattedAddress}</span>
        <div className="stop-meta">
          <b>{hours(location.startsAt, location.expiresAt)}</b>
          <small>
            {location.distance
              ? `${location.distance.toFixed(1)} mi away`
              : location.isActive ? "Open now" : "Scheduled"}
          </small>
        </div>
      </div>
      <span className="chevron">→</span>
    </button>
  );
}

export default function NearbyExplorer() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [position, setPosition] = useState(fallback);
  const [status, setStatus] = useState("Requesting your location…");
  const [selected, setSelected] = useState(0);

  const load = useCallback(async (coords: typeof fallback) => {
    setStatus("Looking for food trucks…");

    try {
      const response = await fetch(
        `/api/nearby?latitude=${coords.latitude}&longitude=${coords.longitude}`,
      );
      const data = await response.json();

      setLocations(data.locations ?? []);
      setSelected(0);
      setStatus(
        data.locations?.length
          ? `${data.locations.length} stops found near you`
          : "No trucks found in this area yet",
      );
    } catch {
      setStatus("We couldn’t load nearby trucks. Please try again.");
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("Location isn’t available in this browser. Showing Pittsburgh-area trucks.");
      void load(fallback);
      return;
    }

    setStatus("Requesting your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextPosition = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setPosition(nextPosition);
        void load(nextPosition);
      },
      () => {
        setStatus("Location access is off. Showing Pittsburgh-area trucks.");
        void load(fallback);
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }, [load]);

  useEffect(() => {
    const request = window.setTimeout(requestLocation, 0);

    return () => window.clearTimeout(request);
  }, [requestLocation]);

  const mapLocations = useMemo(() => locations.slice(0, 12), [locations]);
  const groups = useMemo(() => {
    const now = new Date();
    const grouped = new Map<string, VisibleLocation[]>();

    mapLocations.forEach((location, index) => {
      const label = groupLabel(location, now);
      const items = grouped.get(label) ?? [];

      items.push({ location, index });
      grouped.set(label, items);
    });

    return [...grouped.entries()];
  }, [mapLocations]);

  return (
    <section className="nearby shell">
      <div className="nearby-heading">
        <div>
          <p className="eyebrow"><i /> Food trucks near you</p>
          <h1>What&apos;s cooking <em>nearby?</em></h1>
          <div className="nearby-location-summary">
            <span>{status}</span>
            <span>
              Coordinates: {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
            </span>
          </div>
        </div>
        <button className="locate-button" onClick={requestLocation}>
          ⌖ Use my location
        </button>
      </div>
      <div className="explorer">
        <aside className="truck-list">
          {groups.map(([label, items]) => (
            <section className="schedule-group" key={label}>
              <div className="list-label">{label}</div>
              {items.map((item) => (
                <StopListItem
                  isSelected={selected === item.index}
                  item={item}
                  key={item.location.id}
                  onSelect={() => setSelected(item.index)}
                />
              ))}
            </section>
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
