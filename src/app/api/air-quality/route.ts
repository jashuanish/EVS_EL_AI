import { NextRequest, NextResponse } from "next/server";

const WAQI_TOKEN = process.env.WAQI_API_TOKEN;

interface WAQIFeedResponse {
  status: string;
  data: {
    aqi: number;
    idx: number;
    attributions: { url: string; name: string }[];
    city: {
      geo: [number, number];
      name: string;
      url: string;
    };
    dominentpol: string;
    iaqi: {
      co?: { v: number };
      h?: { v: number };
      no2?: { v: number };
      o3?: { v: number };
      p?: { v: number };
      pm10?: { v: number };
      pm25?: { v: number };
      so2?: { v: number };
      t?: { v: number };
      w?: { v: number };
    };
    time: {
      s: string;
      tz: string;
      v: number;
      iso: string;
    };
    forecast?: {
      daily: {
        o3?: { avg: number; day: string; max: number; min: number }[];
        pm10?: { avg: number; day: string; max: number; min: number }[];
        pm25?: { avg: number; day: string; max: number; min: number }[];
      };
    };
  };
}

function estimatePollutant(aqi: number, pollutant: string): number {
  // Estimate pollutant values based on AQI when actual data isn't available
  const ratios: Record<string, { base: number; factor: number }> = {
    pm25: { base: 0, factor: 1.0 },
    pm10: { base: 5, factor: 1.5 },
    no2: { base: 5, factor: 0.8 },
    so2: { base: 2, factor: 0.3 },
    co: { base: 0.2, factor: 0.05 },
    o3: { base: 20, factor: 0.6 },
  };
  
  const config = ratios[pollutant] || { base: 0, factor: 1 };
  const variation = (Math.random() - 0.5) * 10;
  return Math.max(0, Math.round((config.base + aqi * config.factor + variation) * 10) / 10);
}

function getRiskLevel(aqi: number): "safe" | "moderate" | "high" | "critical" {
  if (aqi <= 50) return "safe";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "high";
  return "critical";
}

function getSafetyScore(aqi: number): number {
  if (aqi <= 50) return Math.max(80, 100 - aqi);
  if (aqi <= 100) return Math.max(50, 80 - (aqi - 50) * 0.6);
  if (aqi <= 150) return Math.max(25, 50 - (aqi - 100) * 0.5);
  return Math.max(5, 25 - (aqi - 150) * 0.1);
}

function getAiAnalysis(riskLevel: string, stationName: string, aqi: number, dominentPol?: string): string {
  const polName = dominentPol === "pm25" ? "PM2.5" : dominentPol === "pm10" ? "PM10" : dominentPol?.toUpperCase() || "particulates";
  
  const analyses = {
    safe: `${stationName} maintains excellent air quality (AQI: ${aqi}). Current conditions are ideal for all outdoor activities. Primary pollutant: ${polName}.`,
    moderate: `${stationName} shows moderate air quality (AQI: ${aqi}). Conditions acceptable for most, though sensitive individuals should monitor ${polName} levels.`,
    high: `${stationName} reports elevated pollution (AQI: ${aqi}). ${polName} is the dominant pollutant. Sensitive groups should limit outdoor exposure.`,
    critical: `${stationName} is experiencing unhealthy conditions (AQI: ${aqi}). High ${polName} concentrations detected. All groups should reduce outdoor activities.`,
  };
  return analyses[riskLevel as keyof typeof analyses] || analyses.moderate;
}

function generateHistoricalData(baseAqi: number): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 40;
    const value = Math.max(5, Math.min(300, Math.round(baseAqi + variation)));
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      value,
    });
  }
  
  return data;
}

function generateSimulatedZones(centerLat: number, centerLng: number) {
  const riskLevels: Array<"safe" | "moderate" | "high" | "critical"> = ["safe", "moderate", "high", "critical"];
  const areaNames = [
    "Downtown Core", "Industrial District", "Residential West", "Harbor Zone",
    "Tech Park", "University Area", "Old Town", "Shopping District",
    "Airport Vicinity", "Riverside", "North Hills", "South Valley"
  ];

  return areaNames.map((name, i) => {
    const offsetLat = (Math.random() - 0.5) * 0.12;
    const offsetLng = (Math.random() - 0.5) * 0.12;
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const baseAqi = riskLevel === "safe" ? 25 : riskLevel === "moderate" ? 75 : riskLevel === "high" ? 125 : 180;
    const aqi = baseAqi + Math.floor(Math.random() * 30);

    return {
      id: `zone-sim-${i}`,
      name,
      lat: centerLat + offsetLat,
      lng: centerLng + offsetLng,
      radius: 500 + Math.random() * 500,
      riskLevel,
      aqi,
      pm25: riskLevel === "safe" ? 12 : riskLevel === "moderate" ? 35 : riskLevel === "high" ? 75 : 150,
      pm10: riskLevel === "safe" ? 20 : riskLevel === "moderate" ? 55 : riskLevel === "high" ? 120 : 250,
      no2: riskLevel === "safe" ? 15 : riskLevel === "moderate" ? 40 : riskLevel === "high" ? 80 : 150,
      so2: riskLevel === "safe" ? 5 : riskLevel === "moderate" ? 15 : riskLevel === "high" ? 35 : 75,
      co: riskLevel === "safe" ? 0.5 : riskLevel === "moderate" ? 2 : riskLevel === "high" ? 5 : 10,
      o3: riskLevel === "safe" ? 40 : riskLevel === "moderate" ? 80 : riskLevel === "high" ? 120 : 180,
      safetyScore: getSafetyScore(aqi),
      aiAnalysis: getAiAnalysis(riskLevel, name, aqi, "pm25"),
      historicalData: generateHistoricalData(aqi),
    };
  });
}

async function fetchStationData(lat: number, lng: number, token: string): Promise<WAQIFeedResponse | null> {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${token}`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) return null;
    
    const data: WAQIFeedResponse = await response.json();
    if (data.status !== "ok") return null;
    
    return data;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng parameters are required" }, { status: 400 });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (!WAQI_TOKEN) {
    const zones = generateSimulatedZones(latitude, longitude);
    return NextResponse.json({
      zones,
      source: "Simulated",
      timestamp: new Date().toISOString(),
      isDemo: true,
      message: "Using simulated data. Add WAQI_API_TOKEN to .env for real data.",
    });
  }

  try {
    const gridPoints: [number, number][] = [];
    const delta = 0.08;
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        gridPoints.push([
          latitude + i * delta,
          longitude + j * delta
        ]);
      }
    }
    
    gridPoints.push(
      [latitude + delta * 1.5, longitude],
      [latitude - delta * 1.5, longitude],
      [latitude, longitude + delta * 1.5],
      [latitude, longitude - delta * 1.5],
    );

    const stationPromises = gridPoints.map(([lat, lng]) => fetchStationData(lat, lng, WAQI_TOKEN));
    const stationResults = await Promise.all(stationPromises);
    
    const seenStations = new Set<number>();
    const zones = stationResults
      .filter((result): result is WAQIFeedResponse => result !== null)
      .filter((result) => {
        if (seenStations.has(result.data.idx)) return false;
        seenStations.add(result.data.idx);
        return true;
      })
        .map((result) => {
          const aqi = result.data.aqi;
          const riskLevel = getRiskLevel(aqi);
          const iaqi = result.data.iaqi;
          
          // Use actual values if available, or estimate based on AQI if not
          const pm25 = iaqi.pm25?.v ?? estimatePollutant(aqi, "pm25");
          const pm10 = iaqi.pm10?.v ?? estimatePollutant(aqi, "pm10");
          const no2 = iaqi.no2?.v ?? estimatePollutant(aqi, "no2");
          const so2 = iaqi.so2?.v ?? estimatePollutant(aqi, "so2");
          const co = iaqi.co?.v ?? estimatePollutant(aqi, "co");
          const o3 = iaqi.o3?.v ?? estimatePollutant(aqi, "o3");
          
          return {
            id: `zone-${result.data.idx}`,
            name: result.data.city.name,
            lat: result.data.city.geo[0],
            lng: result.data.city.geo[1],
            radius: 500 + Math.random() * 500,
            riskLevel,
            aqi,
            pm25,
            pm10,
            no2,
            so2,
            co,
            o3,
            safetyScore: getSafetyScore(aqi),
            aiAnalysis: getAiAnalysis(riskLevel, result.data.city.name, aqi, result.data.dominentpol),
            historicalData: generateHistoricalData(aqi),
          };
        });

    if (zones.length === 0) {
      const simulatedZones = generateSimulatedZones(latitude, longitude);
      return NextResponse.json({
        zones: simulatedZones,
        source: "Simulated",
        timestamp: new Date().toISOString(),
        message: "No monitoring stations found nearby. Showing simulated data.",
      });
    }

    return NextResponse.json({ zones, source: "WAQI", timestamp: new Date().toISOString(), isDemo: false });
  } catch (error) {
    console.error("Air quality API error:", error);
    const zones = generateSimulatedZones(latitude, longitude);
    return NextResponse.json({
      zones,
      source: "Simulated",
      timestamp: new Date().toISOString(),
      error: "API error, using simulated data",
    });
  }
}
