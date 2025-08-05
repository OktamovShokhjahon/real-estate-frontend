import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type"); // 'city' or 'street'
  const city = searchParams.get("city"); // for street search
  const limit = searchParams.get("limit") || "10";

  console.log("Geocoding API called with:", { query, type, city, limit });

  if (!query || !type) {
    console.log("Missing required parameters");
    return NextResponse.json(
      { error: "Missing required parameters: q and type" },
      { status: 400 }
    );
  }

  try {
    let suggestions: any[] = [];

    if (type === "city") {
      // Use GeoNames API for city search
      const baseUrl = "http://api.geonames.org/searchJSON";
      const params = new URLSearchParams({
        name_startsWith: query,
        maxRows: limit,
        username: "oktamov_shohjahon",
        featureClass: "P", // populated places (city, village, etc)
      });

      const url = `${baseUrl}?${params}`;
      console.log("Calling GeoNames API:", url);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("GeoNames response:", data);

      if (Array.isArray(data.geonames)) {
        suggestions = data.geonames.map((item: any) => ({
          geonameId: item.geonameId,
          name: item.name,
          countryName: item.countryName,
          adminName1: item.adminName1,
          lat: item.lat,
          lng: item.lng,
          display_name: `${item.name}${
            item.adminName1 ? ", " + item.adminName1 : ""
          }${item.countryName ? ", " + item.countryName : ""}`,
          type: item.fcodeName,
          address: {
            city: item.name,
            state: item.adminName1,
            country: item.countryName,
          },
        }));
      }
    } else if (type === "street") {
      // No street search in GeoNames API, return empty or error
      // Optionally, you could fallback to another API or return a message
      return NextResponse.json(
        { error: "Street search is not supported with GeoNames API" },
        { status: 400 }
      );
    }

    console.log("Filtered suggestions count:", suggestions.length);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch location data" },
      { status: 500 }
    );
  }
}
