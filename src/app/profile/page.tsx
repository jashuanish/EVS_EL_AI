"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  MapPin,
  Sun,
  Moon,
  Trash2,
  Plus,
  Settings,
  Activity,
  Globe,
  Mail,
  Check,
  X
} from "lucide-react";
import { CITIES, getAqiCategory } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const savedCities = CITIES.slice(0, 4);

const notifications = [
  {
    id: "1",
    type: "alert",
    title: "Air Quality Alert",
    message: "Delhi AQI has reached critical levels (185)",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Weekly Report",
    message: "Your weekly air quality report is ready",
    time: "1 day ago",
    read: true,
  },
  {
    id: "3",
    type: "success",
    title: "Air Quality Improved",
    message: "London air quality has improved to Good",
    time: "3 days ago",
    read: true,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"cities" | "alerts" | "settings">("cities");
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="font-semibold text-white">Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-50" />
                <Avatar className="relative w-20 h-20 border-2 border-cyan-500/50">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">John Doe</h2>
                <p className="text-slate-400">john.doe@example.com</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                    Premium
                  </span>
                  <span className="text-xs text-slate-500">Member since Jan 2024</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-2 mb-6">
            {[
              { id: "cities", label: "Saved Cities", icon: MapPin },
              { id: "alerts", label: "Notifications", icon: Bell },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "glass text-slate-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "cities" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Saved Cities</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add City
                </button>
              </div>
              
              {savedCities.map((city, index) => {
                const aqiInfo = getAqiCategory(city.aqi);
                return (
                  <motion.div
                    key={city.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-4 flex items-center justify-between group"
                  >
                    <Link
                      href={`/map?city=${city.id}`}
                      className="flex items-center gap-4 flex-1"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${aqiInfo.color}20` }}
                      >
                        <Globe className="w-6 h-6" style={{ color: aqiInfo.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{city.name}</p>
                        <p className="text-sm text-slate-400">{city.country}</p>
                      </div>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-bold" style={{ color: aqiInfo.color }}>
                          AQI {city.aqi}
                        </p>
                        <p className="text-xs text-slate-400">{aqiInfo.label}</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "alerts" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Notifications</h3>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  Mark all as read
                </button>
              </div>

              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass rounded-xl p-4 ${
                    !notification.read ? "border border-cyan-500/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        notification.type === "alert"
                          ? "bg-red-500/20"
                          : notification.type === "success"
                          ? "bg-green-500/20"
                          : "bg-cyan-500/20"
                      }`}
                    >
                      {notification.type === "alert" ? (
                        <Activity className="w-5 h-5 text-red-400" />
                      ) : notification.type === "success" ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Bell className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{notification.title}</p>
                        <span className="text-xs text-slate-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">Dark Mode</p>
                      <p className="text-sm text-slate-400">Use dark theme</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-white">Email Alerts</p>
                        <p className="text-sm text-slate-400">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-white">Push Notifications</p>
                        <p className="text-sm text-slate-400">Receive push notifications</p>
                      </div>
                    </div>
                    <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-white">Critical Alerts Only</p>
                        <p className="text-sm text-slate-400">Only notify for critical AQI levels</p>
                      </div>
                    </div>
                    <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-slate-300">Edit Profile</span>
                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-slate-300">Change Password</span>
                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-red-400">
                    <span>Sign Out</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
