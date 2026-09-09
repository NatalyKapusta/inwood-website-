"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import dealers from "@/data/dealers.json";

export default function DealersMap({ getDirectionsLabel }: { getDirectionsLabel: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapRef.current) return;
    initialized.current = true;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!, { zoomControl: true }).setView([49.0, 31.5], 6);

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

      const bounds: [number, number][] = [];
      dealers.forEach((d) => {
        const marker = L.marker([d.lat, d.lon], { icon }).addTo(map);
        const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lon}`;
        const phonesHtml = (d.phonesTel || [])
          .map(
            (tel, i) =>
              `<a class="iw-popup-link" href="tel:${tel}">${d.phones?.[i] ?? tel}</a>`
          )
          .join("");
        const sitesHtml = (d.sites || [])
          .map(
            (url, i) =>
              `<a class="iw-popup-link" href="${url}" target="_blank" rel="noopener">${
                d.sitesLabel?.[i] ?? url
              }</a>`
          )
          .join("");
        marker.bindPopup(
          `<div style="font-family:Manrope,sans-serif;min-width:180px">` +
            `<p style="font-weight:700;color:#333958;margin:0 0 4px">${d.name}</p>` +
            `<p style="font-size:12px;color:#3F4669;margin:0 0 6px">${d.address}</p>` +
            `<div style="display:flex;flex-direction:column;gap:2px;font-size:12px">${phonesHtml}${sitesHtml}</div>` +
            `<a href="${gmapsUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#B7935A">${getDirectionsLabel}</a>` +
            `</div>`
        );
        bounds.push([d.lat, d.lon]);
      });

      if (bounds.length) map.fitBounds(bounds, { padding: [40, 40] });
    });
  }, [getDirectionsLabel]);

  return <div ref={mapRef} className="h-[520px] w-full rounded-xl" />;
}
