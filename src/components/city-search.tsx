"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { City, getAqiCategory } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface SearchCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  safetyScore: number;
  trend: "up" | "down" | "stable";
  fullName?: string;
}

interface CitySearchProps {
  onCitySelect?: (city: City) => void;
}

export function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();

  const searchCities = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search-city?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.cities || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        searchCities(query);
      }, 300);
    } else {
      setSearchResults([]);
    }
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchCities]);

  const filteredCities = searchResults;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && filteredCities[selectedIndex]) {
      handleCitySelect(filteredCities[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleCitySelect = (city: SearchCity) => {
    setQuery(city.name);
    setIsOpen(false);
    if (onCitySelect) {
      onCitySelect(city as City);
    }
    router.push(`/map?lat=${city.lat}&lng=${city.lng}&name=${encodeURIComponent(city.fullName || city.name)}`);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="w-3 h-3 text-red-400" />;
    if (trend === "down")
      return <TrendingDown className="w-3 h-3 text-green-400" />;
    return <Minus className="w-3 h-3 text-yellow-400" />;
  };

  return (
    <div className="relative w-full max-w-2xl">
      <motion.div
        className="search-glow relative glass-strong rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center px-6 py-4">
          <Search className="w-6 h-6 text-cyan-400 mr-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any city to view real-time safety & pollution intelligence"
            className="flex-1 bg-transparent text-lg text-white placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </motion.div>

        <AnimatePresence>
          {isOpen && (query.trim() || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl overflow-hidden z-50"
            >
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    <span className="ml-2 text-slate-400">Searching worldwide...</span>
                  </div>
                ) : filteredCities.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No cities found for &quot;{query}&quot;</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                ) : (
                  filteredCities.map((city, index) => {
                const aqiInfo = getAqiCategory(city.aqi);
                return (
                  <motion.button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      selectedIndex === index
                        ? "bg-cyan-500/10 border border-cyan-500/30"
                        : "hover:bg-white/5"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${aqiInfo.color}20` }}
                      >
                        <MapPin
                          className="w-5 h-5"
                          style={{ color: aqiInfo.color }}
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{city.name}</p>
                        <p className="text-sm text-slate-400">{city.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className="font-mono text-sm font-semibold"
                          style={{ color: aqiInfo.color }}
                        >
                          AQI {city.aqi}
                        </p>
                        <p className="text-xs text-slate-400">{aqiInfo.label}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(city.trend)}
                      </div>
                    </div>
                    </motion.button>
                  );
                })
                )}
              </div>

            <div className="px-4 py-3 border-t border-white/5">
              <p className="text-xs text-slate-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">↵</kbd> to select
                • <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">↑↓</kbd> to navigate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
