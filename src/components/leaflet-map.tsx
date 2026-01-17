"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PollutionZone, getRiskColor, City } from "@/lib/mock-data";

interface LeafletMapProps {
  city: City;
  zones: PollutionZone[];
  isDarkMode: boolean;
  showLayers: boolean;
  onZoneSelect: (zone: PollutionZone) => void;
  onZoomChange: (zoom: number) => void;
}

export default function LeafletMap({
  city,
  zones,
  isDarkMode,
  showLayers,
  onZoneSelect,
  onZoomChange,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const heatLayersRef = useRef<L.Circle[]>([]);
  const onZoneSelectRef = useRef(onZoneSelect);
  
  useEffect(() => {
    onZoneSelectRef.current = onZoneSelect;
  }, [onZoneSelect]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [city.lat, city.lng],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    mapRef.current.on("zoomend", () => {
      if (mapRef.current) {
        onZoomChange(mapRef.current.getZoom());
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });

    const tileUrl = isDarkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(mapRef.current);
  }, [isDarkMode]);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setView([city.lat, city.lng], 12);
  }, [city]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    heatLayersRef.current.forEach((layer) => layer.remove());
    markersRef.current = [];
    heatLayersRef.current = [];

    if (!showLayers) return;

    zones.forEach((zone) => {
      const color = getRiskColor(zone.riskLevel);

      const heatCircle = L.circle([zone.lat, zone.lng], {
        radius: 800,
        fillColor: color,
        fillOpacity: 0.3,
        stroke: false,
        interactive: true,
      }).addTo(mapRef.current!);
      heatLayersRef.current.push(heatCircle);

      const marker = L.circleMarker([zone.lat, zone.lng], {
        radius: 14,
        fillColor: color,
        fillOpacity: 1,
        color: "#ffffff",
        weight: 3,
        opacity: 0.9,
        interactive: true,
        bubblingMouseEvents: false,
      }).addTo(mapRef.current!);

      marker.bindTooltip(
        `<div style="padding: 8px; min-width: 150px;">
          <p style="font-weight: 600; margin-bottom: 4px;">${zone.name}</p>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">AQI</span>
            <span style="font-family: monospace; font-weight: bold; color: ${color};">${zone.aqi}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span style="color: #94a3b8;">Status</span>
            <span style="text-transform: capitalize; font-weight: 500; color: ${color};">${zone.riskLevel}</span>
          </div>
          <p style="margin-top: 8px; font-size: 11px; color: #64748b;">Click for details</p>
        </div>`,
        {
          direction: "top",
          offset: [0, -10],
          className: "custom-tooltip",
        }
      );

      marker.on("click", () => {
        console.log("Marker clicked:", zone.name);
        onZoneSelectRef.current(zone);
      });

      heatCircle.on("click", () => {
        console.log("Heat circle clicked:", zone.name);
        onZoneSelectRef.current(zone);
      });

      markersRef.current.push(marker);
    });
  }, [zones, showLayers]);

  return (
    <>
      <style jsx global>{`
        .custom-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
          padding: 0 !important;
        }
        .custom-tooltip .leaflet-tooltip-content {
          margin: 0 !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
        .leaflet-interactive {
          cursor: pointer !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </>
  );
}
