"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Navigation,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  Sun,
  Moon,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { PollutionZone, getRiskColor, getAqiCategory, generatePollutionZones, City, calculateSafetyScore } from "@/lib/mock-data";
import { AreaDetailPanel } from "./area-detail-panel";

interface PollutionMapProps {
  city: City;
}

const MapWithNoSSR = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#030712]">
      <div className="text-cyan-400 animate-pulse">Loading map...</div>
    </div>
  ),
});

export function PollutionMap({ city }: PollutionMapProps) {
  const [zones, setZones] = useState<PollutionZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<PollutionZone | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<"city" | "neighborhood" | "street">("neighborhood");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cityAqi, setCityAqi] = useState(city.aqi);
  const [dataSource, setDataSource] = useState<string>("Loading");

  const fetchAirQualityData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/air-quality?lat=${city.lat}&lng=${city.lng}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch air quality data");
      }
      
      const data = await response.json();
      
      if (data.zones && data.zones.length > 0) {
        setZones(data.zones);
        const avgAqi = Math.round(data.zones.reduce((sum: number, z: PollutionZone) => sum + z.aqi, 0) / data.zones.length);
        setCityAqi(avgAqi);
        setLastUpdated(new Date(data.timestamp));
        setDataSource(data.source || "WAQI");
        
        if (data.isDemo || data.source === "Simulated") {
          setError(data.message || "Using simulated data");
        }
      } else {
        const generatedZones = generatePollutionZones(city.lat, city.lng);
        setZones(generatedZones);
        setDataSource("Simulated");
        setError("No real-time stations found. Showing simulated data.");
      }
    } catch (err) {
      console.error("Error fetching air quality data:", err);
      const generatedZones = generatePollutionZones(city.lat, city.lng);
      setZones(generatedZones);
      setDataSource("Simulated");
      setError("Using simulated data. API unavailable.");
    } finally {
      setIsLoading(false);
    }
  }, [city.lat, city.lng]);

  useEffect(() => {
    fetchAirQualityData();
  }, [fetchAirQualityData]);

  const aqiInfo = getAqiCategory(cityAqi);
  const safetyScore = calculateSafetyScore(cityAqi);

  return (
    <div className="relative w-full h-full min-h-[500px]" style={{ height: '100%' }}>
      <MapWithNoSSR
        city={{ ...city, aqi: cityAqi }}
        zones={zones}
        isDarkMode={isDarkMode}
        showLayers={showLayers}
        onZoneSelect={setSelectedZone}
        onZoomChange={(zoom) => {
          if (zoom < 11) {
            setZoomLevel("city");
          } else if (zoom < 14) {
            setZoomLevel("neighborhood");
          } else {
            setZoomLevel("street");
          }
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1500]">
          <div className="glass-strong rounded-xl p-6 flex items-center gap-4">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-white">Loading air quality data...</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-[1000]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl p-4 pointer-events-auto"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${aqiInfo.color}20` }}
            >
              <Activity className="w-7 h-7" style={{ color: aqiInfo.color }} />
            </div>
            <div>
              <p className="text-sm text-slate-400">City AQI</p>
              <p className="text-3xl font-bold" style={{ color: aqiInfo.color }}>
                {cityAqi || "—"}
              </p>
              <p className="text-sm text-slate-400">{aqiInfo.label}</p>
            </div>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-yellow-400 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-semibold text-white">{city.name}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${getRiskColor(safetyScore > 70 ? "safe" : safetyScore > 40 ? "moderate" : "high")}20` }}
              >
                <Activity
                  className="w-5 h-5"
                  style={{ color: getRiskColor(safetyScore > 70 ? "safe" : safetyScore > 40 ? "moderate" : "high") }}
                />
              </div>
              <div>
                <p className="text-xs text-slate-400">Safety Score</p>
                <p className="font-semibold text-white">{Math.round(safetyScore)}/100</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Stations</p>
                <p className="font-semibold text-white">{zones.length} active</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 glass-strong rounded-xl p-3 pointer-events-auto z-[1000]"
      >
        <p className="text-xs text-slate-400 mb-2">Zoom Level: {zoomLevel}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-300">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-slate-300">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs text-slate-300">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-slate-300">Critical</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {dataSource === "Simulated" ? (
            <span className="text-yellow-500">Simulated data</span>
          ) : (
            <span>Real-time from {dataSource}</span>
          )}
          {lastUpdated && ` • ${lastUpdated.toLocaleTimeString()}`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-24 right-4 flex flex-col gap-2 pointer-events-auto z-[1000]"
      >
        <button
          onClick={fetchAirQualityData}
          disabled={isLoading}
          className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-400" />
          )}
        </button>
        <button
          onClick={() => setShowLayers(!showLayers)}
          className={`w-10 h-10 glass-strong rounded-xl flex items-center justify-center transition-colors ${
            showLayers ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-white/10"
          }`}
        >
          <Layers className="w-5 h-5" />
        </button>
      </motion.div>

      <AnimatePresence>
        {selectedZone && (
          <AreaDetailPanel
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
