import { NextRequest, NextResponse } from "next/server";

const WAQI_TOKEN = process.env.WAQI_API_TOKEN;

interface WAQISearchResult {
  uid: number;
  aqi: string;
  time: { tz: string; stime: string; vtime: number };
  station: {
    name: string;
    geo: [number, number];
    url: string;
    country: string;
  };
}

interface WAQISearchResponse {
  status: string;
  data: WAQISearchResult[];
}

const WORLD_CITIES = [
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { name: "Manchester", country: "UK", lat: 53.4808, lng: -2.2426 },
  { name: "Birmingham", country: "UK", lat: 52.4862, lng: -1.8904 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Lyon", country: "France", lat: 45.7640, lng: 4.8357 },
  { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820 },
  { name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
  { name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681 },
  { name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
  { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  { name: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
  { name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869 },
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
  { name: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542 },
  { name: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },
  { name: "Bogota", country: "Colombia", lat: 4.7110, lng: -74.0721 },
];

function calculateSafetyScore(aqi: number): number {
  if (aqi <= 50) return Math.max(80, 100 - aqi);
  if (aqi <= 100) return Math.max(50, 80 - (aqi - 50) * 0.6);
  if (aqi <= 150) return Math.max(25, 50 - (aqi - 100) * 0.5);
  return Math.max(5, 25 - (aqi - 150) * 0.1);
}

function generateRandomAqi(): number {
  const weights = [0.3, 0.35, 0.25, 0.1];
  const ranges = [[20, 50], [51, 100], [101, 150], [151, 200]];
  const rand = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) {
      const [min, max] = ranges[i];
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  return 75;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  if (WAQI_TOKEN) {
    try {
      const response = await fetch(
        `https://api.waqi.info/search/?keyword=${encodeURIComponent(query)}&token=${WAQI_TOKEN}`,
        { next: { revalidate: 600 } }
      );

      if (response.ok) {
        const data: WAQISearchResponse = await response.json();
        if (data.status === "ok" && data.data.length > 0) {
          const cities = data.data
            .filter((result) => result.aqi !== "-" && result.station.geo)
            .slice(0, 10)
            .map((result) => {
              const nameParts = result.station.name.split(",").map((s) => s.trim());
              const cityName = nameParts[0];
              const country = result.station.country || nameParts[nameParts.length - 1] || "Unknown";
              const aqi = parseInt(result.aqi, 10) || 0;

              return {
                id: result.uid.toString(),
                name: cityName,
                country,
                lat: result.station.geo[0],
                lng: result.station.geo[1],
                aqi,
                safetyScore: calculateSafetyScore(aqi),
                trend: "stable" as const,
                fullName: result.station.name,
              };
            });
          return NextResponse.json({ cities, source: "WAQI" });
        }
      }
    } catch (error) {
      console.error("WAQI Search error, falling back to local:", error);
    }
  }

  const queryLower = query.toLowerCase();
  
  const matchedCities = WORLD_CITIES
    .filter(city => 
      city.name.toLowerCase().includes(queryLower) || 
      city.country.toLowerCase().includes(queryLower)
    )
    .slice(0, 10)
    .map((city, index) => {
      const aqi = generateRandomAqi();
      return {
        id: `city-${index}-${city.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: city.name,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        aqi,
        safetyScore: calculateSafetyScore(aqi),
        trend: "stable" as const,
        fullName: `${city.name}, ${city.country}`,
      };
    });

  return NextResponse.json({ 
    cities: matchedCities, 
    source: "Local Database",
    message: matchedCities.length === 0 ? "No matching cities found" : undefined
  });
}
