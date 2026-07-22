export type Truck = { id: number; name: string; handle: string; summary?: string; imageUrl?: string; homeCity?: string; bio?: string; website?: string; phone?: string; instagram?: string; menu?: { menuItems: MenuItem[] }; currentLocation?: Location | null; nextLocation?: Location | null; scheduledLocations?: Location[] };
export type MenuItem = { id: number; name: string; description?: string; price?: string | number | null; imageUrl?: string };
export type Location = { id: number; landmark?: string; latitude: string; longitude: string; formattedAddress?: string; startsAt: string; expiresAt: string; isActive?: boolean; distance?: number; trucks: Truck[] };

const ORIGIN = "https://www.mobilenom.com";
export async function getTruck(handle: string): Promise<Truck | null> {
  const response = await fetch(`${ORIGIN}/api/v3/handle_entities/${encodeURIComponent(handle)}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  return data.type === "TruckInfo" ? data.entity : null;
}
