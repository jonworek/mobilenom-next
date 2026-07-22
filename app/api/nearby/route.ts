import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const latitude = params.get("latitude") ?? "40.4406";
  const longitude = params.get("longitude") ?? "-79.9959";
  const distance = params.get("distance") ?? "50";
  const endpoint = new URL("https://www.mobilenom.com/api/v3/locations");
  endpoint.search = new URLSearchParams({ latitude, longitude, distance, timestamp: new Date().toISOString() }).toString();
  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) return NextResponse.json({ message: "The legacy locations service is unavailable." }, { status: response.status });
  return NextResponse.json(await response.json());
}
