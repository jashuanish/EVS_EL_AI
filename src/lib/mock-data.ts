export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  safetyScore: number;
  trend: 'up' | 'down' | 'stable';
  fullName?: string;
}

export interface PollutionZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  safetyScore: number;
  aiAnalysis: string;
  historicalData: { time: string; value: number }[];
}

export interface StreetData {
  id: string;
  name: string;
  coordinates: [number, number][];
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  aqi: number;
}

export const DEFAULT_CITIES: City[] = [
  { id: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'beijing', name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'delhi', name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.209, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, aqi: 0, safetyScore: 0, trend: 'stable' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, aqi: 0, safetyScore: 0, trend: 'stable' },
];

export const CITIES = DEFAULT_CITIES;

export function getRiskLevel(aqi: number): 'safe' | 'moderate' | 'high' | 'critical' {
  if (aqi <= 50) return 'safe';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'high';
  return 'critical';
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'safe': return '#22c55e';
    case 'moderate': return '#eab308';
    case 'high': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#94a3b8';
  }
}

export function getAqiCategory(aqi: number): { label: string; color: string; riskLevel: string } {
  if (aqi <= 50) return { label: 'Good', color: '#22c55e', riskLevel: 'safe' };
  if (aqi <= 100) return { label: 'Moderate', color: '#eab308', riskLevel: 'moderate' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316', riskLevel: 'high' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', riskLevel: 'critical' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#dc2626', riskLevel: 'critical' };
  return { label: 'Hazardous', color: '#7f1d1d', riskLevel: 'critical' };
}

export function calculateSafetyScore(aqi: number): number {
  if (aqi <= 50) return Math.max(80, 100 - aqi);
  if (aqi <= 100) return Math.max(50, 80 - (aqi - 50) * 0.6);
  if (aqi <= 150) return Math.max(25, 50 - (aqi - 100) * 0.5);
  return Math.max(5, 25 - (aqi - 150) * 0.1);
}

export function generatePollutionZones(centerLat: number, centerLng: number): PollutionZone[] {
  const zones: PollutionZone[] = [];
  const riskLevels: Array<'safe' | 'moderate' | 'high' | 'critical'> = ['safe', 'moderate', 'high', 'critical'];
  const areaNames = [
    'Downtown Core', 'Industrial District', 'Residential West', 'Harbor Zone',
    'Tech Park', 'University Area', 'Old Town', 'Shopping District',
    'Airport Vicinity', 'Riverside', 'North Hills', 'South Valley'
  ];

  for (let i = 0; i < 12; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.15;
    const offsetLng = (Math.random() - 0.5) * 0.15;
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    const baseAqi = riskLevel === 'safe' ? 25 : riskLevel === 'moderate' ? 75 : riskLevel === 'high' ? 125 : 180;
    const aqi = baseAqi + Math.floor(Math.random() * 30);

    zones.push({
      id: `zone-${i}`,
      name: areaNames[i],
      lat: centerLat + offsetLat,
      lng: centerLng + offsetLng,
      radius: 500 + Math.random() * 1000,
      riskLevel,
      aqi,
      pm25: riskLevel === 'safe' ? 12 : riskLevel === 'moderate' ? 35 : riskLevel === 'high' ? 75 : 150,
      pm10: riskLevel === 'safe' ? 20 : riskLevel === 'moderate' ? 55 : riskLevel === 'high' ? 120 : 250,
      no2: riskLevel === 'safe' ? 15 : riskLevel === 'moderate' ? 40 : riskLevel === 'high' ? 80 : 150,
      so2: riskLevel === 'safe' ? 5 : riskLevel === 'moderate' ? 15 : riskLevel === 'high' ? 35 : 75,
      co: riskLevel === 'safe' ? 0.5 : riskLevel === 'moderate' ? 2 : riskLevel === 'high' ? 5 : 10,
      o3: riskLevel === 'safe' ? 40 : riskLevel === 'moderate' ? 80 : riskLevel === 'high' ? 120 : 180,
      safetyScore: riskLevel === 'safe' ? 90 : riskLevel === 'moderate' ? 65 : riskLevel === 'high' ? 40 : 15,
      aiAnalysis: getAiAnalysis(riskLevel, areaNames[i]),
      historicalData: generateHistoricalData(),
    });
  }

  return zones;
}

function getAiAnalysis(riskLevel: string, areaName: string): string {
  const analyses = {
    safe: `${areaName} maintains excellent air quality with minimal pollution sources. Green spaces and low traffic density contribute to healthy conditions. Recommended for outdoor activities.`,
    moderate: `${areaName} shows moderate pollution levels, primarily from traffic emissions during peak hours. Air quality is acceptable but sensitive groups should monitor conditions.`,
    high: `${areaName} experiences elevated pollution due to industrial activity and heavy traffic. Residents are advised to limit outdoor exposure, especially during morning and evening rush hours.`,
    critical: `${areaName} is experiencing critical air quality conditions. High concentrations of particulate matter and NOx detected. Health advisory in effect - avoid outdoor activities and use air filtration indoors.`,
  };
  return analyses[riskLevel as keyof typeof analyses];
}

function generateHistoricalData(): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: 30 + Math.floor(Math.random() * 120),
    });
  }
  
  return data;
}
