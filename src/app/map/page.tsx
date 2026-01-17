"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Loader2, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { PollutionMap } from "@/components/pollution-map";
import { City, getAqiCategory, DEFAULT_CITIES, calculateSafetyScore } from "@/lib/mock-data";

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCityList, setShowCityList] = useState(false);
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [popularCities, setPopularCities] = useState<City[]>(DEFAULT_CITIES);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const cityName = searchParams.get("name") || searchParams.get("city");

  useEffect(() => {
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      setSelectedCity({
        id: "custom",
        name: cityName ? decodeURIComponent(cityName) : "Selected Location",
        country: "",
        lat: latitude,
        lng: longitude,
        aqi: 0,
        safetyScore: 0,
        trend: "stable",
      });
    } else {
      setSelectedCity(DEFAULT_CITIES[0]);
    }
  }, [lat, lng, cityName]);

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-city?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.cities || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      const filtered = DEFAULT_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.country.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchCities(searchQuery);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, searchCities]);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          router.push(`/map?lat=${latitude}&lng=${longitude}&city=My Location`);
          setShowCityList(false);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to get your location. Please allow location access or search for a city.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSelectCity = (city: City) => {
    router.push(`/map?lat=${city.lat}&lng=${city.lng}&city=${encodeURIComponent(city.name)}`);
    setShowCityList(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  if (!selectedCity) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const displayCities = searchQuery.length >= 2 ? searchResults : popularCities;
  const aqiInfo = selectedCity.aqi ? getAqiCategory(selectedCity.aqi) : { color: "#94a3b8" };

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              
              <div className="h-6 w-px bg-white/10" />

              <div className="relative">
                <button
                  onClick={() => setShowCityList(!showCityList)}
                  className="flex items-center gap-3 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: aqiInfo.color }}
                  />
                  <span className="font-medium text-white">{selectedCity.name}</span>
                  {selectedCity.country && (
                    <span className="text-slate-400">{selectedCity.country}</span>
                  )}
                </button>

                {showCityList && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-96 glass-strong rounded-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search any city worldwide..."
                          className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-cyan-500/50"
                          autoFocus
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 animate-spin" />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleUseMyLocation}
                      disabled={isLocating}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/10 transition-colors border-b border-white/10"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-cyan-400">Use My Location</p>
                        <p className="text-xs text-slate-400">Get air quality for your current location</p>
                      </div>
                    </button>

                    <div className="max-h-64 overflow-y-auto no-scrollbar">
                      {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                        <div className="px-4 py-6 text-center text-slate-400">
                          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No cities found for &quot;{searchQuery}&quot;</p>
                          <p className="text-xs mt-1">Try a different search term</p>
                        </div>
                      )}
                      
                      {displayCities.length > 0 && (
                        <>
                          <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider">
                            {searchQuery.length >= 2 ? "Search Results" : "Popular Cities"}
                          </p>
                          {displayCities.map((city) => {
                            const cityAqiInfo = city.aqi ? getAqiCategory(city.aqi) : { color: "#94a3b8" };
                            return (
                              <button
                                key={city.id}
                                onClick={() => handleSelectCity(city)}
                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${
                                  city.lat === selectedCity.lat && city.lng === selectedCity.lng ? "bg-cyan-500/10" : ""
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: cityAqiInfo.color }}
                                  />
                                  <div className="text-left">
                                    <p className="font-medium text-white">{city.name}</p>
                                    <p className="text-xs text-slate-400">{city.country}</p>
                                  </div>
                                </div>
                                {city.aqi > 0 && (
                                  <span
                                    className="font-mono text-sm"
                                    style={{ color: cityAqiInfo.color }}
                                  >
                                    AQI {city.aqi}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden md:inline">
                Real-time data from WAQI
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 h-screen">
        <PollutionMap city={selectedCity} />
      </div>

      {showCityList && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCityList(false)}
        />
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
