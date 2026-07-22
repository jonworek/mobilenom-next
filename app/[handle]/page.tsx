import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTruck } from "../../lib/mobilenom";

export const dynamic = "force-dynamic";

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export default async function TruckPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const truck = await getTruck(handle);

  if (!truck) notFound();

  const schedule = truck.scheduledLocations ?? (truck.nextLocation ? [truck.nextLocation] : []);

  return (
    <main className="profile">
      <nav className="nav shell">
        <Link className="brand" href="/"><span>MN</span> mobile nom</Link>
        <Link className="back-link" href="/nearby">← Nearby trucks</Link>
      </nav>
      <section className="profile-hero shell">
        <div>
          <p className="eyebrow"><i /> {truck.homeCity || "Food truck"}</p>
          <h1>{truck.name}</h1>
          <p className="profile-summary">
            {truck.summary || "A local food truck worth tracking down."}
          </p>
          <div className="profile-links">
            {truck.website && <a href={truck.website} target="_blank" rel="noreferrer">Website ↗</a>}
            {truck.instagram && (
              <a href={`https://instagram.com/${truck.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            )}
            {truck.phone && <a href={`tel:${truck.phone}`}>{truck.phone}</a>}
          </div>
        </div>
        <div className="profile-image">
          {truck.imageUrl ? (
            <Image
              src={truck.imageUrl}
              alt={truck.name}
              fill
              sizes="(max-width: 760px) 100vw, 40vw"
              unoptimized
            />
          ) : <span>🍟</span>}
          <div className="image-sun" />
        </div>
      </section>
      <section className="profile-content shell">
        <div className="profile-main">
          <div className="section-label">The story</div>
          <p className="bio">{truck.bio || truck.summary}</p>
          {truck.menu?.menuItems?.length ? (
            <>
              <div className="section-label menu-label">On the menu</div>
              <div className="menu-grid">
                {truck.menu.menuItems.map((item) => (
                  <article key={item.id}>
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                    {item.price && <span>${item.price}</span>}
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
        <aside className="schedule-card">
          <p className="section-label">Find them next</p>
          {schedule.length ? schedule.slice(0, 5).map((location) => (
            <div className="schedule-row" key={location.id}>
              <b>{formatDate(location.startsAt)}</b>
              <span>{location.landmark || location.formattedAddress}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Directions ↗
              </a>
            </div>
          )) : <p className="empty">No upcoming stops are posted yet. Check back soon.</p>}
        </aside>
      </section>
    </main>
  );
}
