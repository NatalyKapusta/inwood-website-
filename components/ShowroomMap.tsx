"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Координати заводу/шоуруму IN WOOD — провулок Спортивний, 4, Полтава
// (геокодинг адреси; звірити вручну в Google Maps при налаштуванні Google Business Profile).
const SHOWROOM_LAT = 49.60915;
const SHOWROOM_LON = 34.51545;

export default function ShowroomMap({ address, getDirectionsLabel }: { address: string; getDirectionsLabel: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapRef.current) return;
    initialized.current = true;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false }).setView(
        [SHOWROOM_LAT, SHOWROOM_LON],
        16
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:34px;height:34px;border-radius:50%;background:#333958;
          border:2.5px solid #E3CCA1;box-shadow:0 2px 8px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;color:#E3CCA1;
          font-family:'Playfair Display',serif;font-weight:800;font-size:14px;">W</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -14],
      });

      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${SHOWROOM_LAT},${SHOWROOM_LON}`;
      const marker = L.marker([SHOWROOM_LAT, SHOWROOM_LON], { icon }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:Manrope,sans-serif;min-width:160px">` +
          `<p style="font-weight:700;color:#333958;margin:0 0 4px">IN WOOD</p>` +
          `<p style="font-size:12px;color:#3F4669;margin:0 0 6px">${address}</p>` +
          `<a href="${gmapsUrl}" target="_blank" rel="noopener" style="display:inline-block;font-size:12px;font-weight:600;color:#B7935A">${getDirectionsLabel}</a>` +
          `</div>`
      );
    });
  }, [address, getDirectionsLabel]);

  return <div ref={mapRef} className="h-[320px] w-full rounded-xl" />;
}
