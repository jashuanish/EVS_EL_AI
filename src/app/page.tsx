"use client";

import { motion } from "framer-motion";
import { 
  Satellite, 
  Shield, 
  Activity, 
  Map, 
  Brain,
  TrendingUp,
  Zap,
  Globe,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { CitySearch } from "@/components/city-search";
import { ParticleBackground, GridBackground, GlobeVisualization } from "@/components/backgrounds";
import { CITIES, getAqiCategory } from "@/lib/mock-data";
import Link from "next/link";

const features = [
  {
    icon: Satellite,
    title: "Satellite Intelligence",
    description: "Real-time satellite data combined with ground sensors for complete coverage"
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Machine learning models predict pollution patterns with high accuracy"
  },
  {
    icon: Map,
    title: "Street-Level Detail",
    description: "Zoom from city overview to individual streets with color-coded risk zones"
  },
  {
    icon: Shield,
    title: "Safety Scoring",
    description: "Comprehensive safety metrics for any location in real-time"
  },
  {
    icon: Activity,
    title: "Health Monitoring",
    description: "Track PM2.5, PM10, NO₂, and other harmful pollutants"
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Get notified when air quality changes in your saved locations"
  }
];

const stats = [
  { value: "500+", label: "Cities Monitored" },
  { value: "99.7%", label: "Data Accuracy" },
  { value: "24/7", label: "Real-time Updates" },
  { value: "10M+", label: "Daily Data Points" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030712] overflow-hidden">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center">
        <GridBackground />
        <ParticleBackground />
        <GlobeVisualization />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyan-400">
                <Satellite className="w-4 h-4" />
                Environmental Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">From </span>
              <span className="gradient-text glow-text">Satellite</span>
              <br />
              <span className="text-white">to </span>
              <span className="gradient-text glow-text">Street</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-xl"
            >
              The most advanced pollution and safety mapping AI. 
              Know the air quality of any street, anywhere, in real-time.
            </motion.p>

            <CitySearch />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              {CITIES.slice(0, 4).map((city, index) => {
                const aqiInfo = getAqiCategory(city.aqi);
                return (
                  <Link
                    key={city.id}
                    href={`/map?city=${city.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-all"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: aqiInfo.color }}
                    />
                    <span className="text-sm text-slate-300">{city.name}</span>
                  </Link>
                );
              })}
              <span className="flex items-center text-sm text-slate-500">
                + {CITIES.length - 4} more cities
              </span>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-2.5 rounded-full bg-cyan-400" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="relative py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Intelligence at Every Scale
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From satellite imagery to street sensors, our AI processes millions of data points 
              to deliver the most accurate pollution insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                See Pollution Like
                <br />
                <span className="gradient-text">Never Before</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Our advanced visualization engine creates intuitive heatmaps that show 
                pollution levels at a glance. Zoom in to see street-level detail or 
                zoom out for city-wide patterns.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time color-coded safety zones",
                  "Interactive zoom with dynamic detail",
                  "Historical data and trend analysis",
                  "AI-generated health recommendations"
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all btn-ripple"
              >
                Explore the Map
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative glass-strong rounded-3xl p-4 overflow-hidden">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0c1222]">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-float" />
                        <p className="text-slate-400">Interactive Map Preview</p>
                        <Link
                          href="/map"
                          className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Launch Full Map
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 glass rounded-xl p-3 animate-fade-in-up">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Safety Score</p>
                          <p className="text-lg font-bold text-green-400">92/100</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 glass rounded-xl p-3 animate-fade-in-up delay-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">AQI Level</p>
                          <p className="text-lg font-bold text-yellow-400">67</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3 animate-fade-in-up delay-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-xs text-slate-400">Safe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="text-xs text-slate-400">Moderate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-orange-500" />
                          <span className="text-xs text-slate-400">High</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-xs text-slate-400">Critical</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Breathe Easier?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join millions of people making informed decisions about air quality 
              and safety in their cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all btn-ripple"
              >
                <Map className="w-5 h-5" />
                Explore the Map
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all">
                <TrendingUp className="w-5 h-5" />
                View Live Stats
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Satellite className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-white">SatelliteToStreet</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 SatelliteToStreet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
