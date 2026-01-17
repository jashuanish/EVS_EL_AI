"use client";

import { motion } from "framer-motion";
import { X, Shield, Activity, Wind, Droplets, AlertTriangle, Brain, Clock } from "lucide-react";
import { PollutionZone, getRiskColor, getAqiCategory } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AreaDetailPanelProps {
  zone: PollutionZone;
  onClose: () => void;
}

export function AreaDetailPanel({ zone, onClose }: AreaDetailPanelProps) {
  const aqiInfo = getAqiCategory(zone.aqi);

  const pollutants = [
    { name: "PM2.5", value: zone.pm25, unit: "µg/m³", max: 150, description: "Fine particulate matter" },
    { name: "PM10", value: zone.pm10, unit: "µg/m³", max: 250, description: "Coarse particulate matter" },
    { name: "NO₂", value: zone.no2, unit: "µg/m³", max: 150, description: "Nitrogen dioxide" },
    { name: "SO₂", value: zone.so2, unit: "µg/m³", max: 75, description: "Sulfur dioxide" },
    { name: "CO", value: zone.co, unit: "mg/m³", max: 10, description: "Carbon monoxide" },
    { name: "O₃", value: zone.o3, unit: "µg/m³", max: 180, description: "Ozone" },
  ];

  return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 bottom-0 w-full max-w-md glass-strong border-l border-white/10 overflow-y-auto no-scrollbar z-[2000]"
      >
      <div className="sticky top-0 z-10 glass-strong border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getRiskColor(zone.riskLevel) }}
            />
            <h2 className="text-xl font-bold text-white">{zone.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium capitalize"
            style={{
              backgroundColor: `${getRiskColor(zone.riskLevel)}20`,
              color: getRiskColor(zone.riskLevel),
            }}
          >
            {zone.riskLevel} Risk
          </span>
          <span className="text-sm text-slate-400">•</span>
          <span className="text-sm text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Live
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">AQI</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: aqiInfo.color }}>
              {zone.aqi}
            </p>
            <p className="text-xs text-slate-400 mt-1">{aqiInfo.label}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Safety</span>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: getRiskColor(zone.riskLevel) }}
            >
              {zone.safetyScore}
            </p>
            <p className="text-xs text-slate-400 mt-1">out of 100</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">AI Analysis</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{zone.aiAnalysis}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Wind className="w-4 h-4 text-slate-400" />
            Pollutant Breakdown
          </h3>
          <div className="space-y-3">
            {pollutants.map((pollutant, index) => {
              const percentage = (pollutant.value / pollutant.max) * 100;
              const color =
                percentage < 40
                  ? "#22c55e"
                  : percentage < 70
                  ? "#eab308"
                  : percentage < 90
                  ? "#f97316"
                  : "#ef4444";

              return (
                <motion.div
                  key={pollutant.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="glass rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-white">{pollutant.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{pollutant.description}</span>
                    </div>
                    <span className="font-mono text-sm" style={{ color }}>
                      {pollutant.value} {pollutant.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            24-Hour Trend
          </h3>
          <div className="glass rounded-xl p-4">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={zone.historicalData}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(148, 163, 184, 0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAqi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-xl p-4 border ${
            zone.riskLevel === "critical"
              ? "pollution-critical"
              : zone.riskLevel === "high"
              ? "pollution-high"
              : zone.riskLevel === "moderate"
              ? "pollution-moderate"
              : "pollution-safe"
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="w-5 h-5 mt-0.5"
              style={{ color: getRiskColor(zone.riskLevel) }}
            />
            <div>
              <h4 className="font-medium text-white mb-1">Health Advisory</h4>
              <p className="text-sm text-slate-300">
                {zone.riskLevel === "safe" && (
                  "Air quality is satisfactory. Outdoor activities are safe for all groups."
                )}
                {zone.riskLevel === "moderate" && (
                  "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion."
                )}
                {zone.riskLevel === "high" && (
                  "Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activities."
                )}
                {zone.riskLevel === "critical" && (
                  "Health warning: Everyone may experience more serious health effects. Avoid all outdoor activities."
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
