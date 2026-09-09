"use client";

import { useMemo, useState } from "react";

type Dealer = {
  name: string;
  address: string;
  phones: string[];
  phonesTel: string[];
  sites?: string[];
  sitesLabel?: string[];
  lat: number;
  lon: number;
};

function extractCity(address: string): string | null {
  const first = address.split(",")[0].trim();
  const m = first.match(/^(?:м\.?|с\.?)\s*(.+)$/);
  if (m) return m[1].trim();
  if (/^[А-ЯІЇЄҐ][а-яіїєґ'-]+$/.test(first)) return first;
  return null;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function groupByCity(dealers: Dealer[]) {
  const withCity = dealers.map((d) => ({ dealer: d, city: extractCity(d.address) }));
  const knownCities = withCity.filter((x) => x.city) as { dealer: Dealer; city: string }[];

  // Для дилерів без міста в адресі — шукаємо найближче за GPS-координатами
  // серед дилерів з відомим містом (у межах 20 км).
  const resolved = withCity.map(({ dealer, city }) => {
    if (city) return { dealer, city };
    let best: { city: string; dist: number } | null = null;
    for (const known of knownCities) {
      const dist = distanceKm(dealer.lat, dealer.lon, known.dealer.lat, known.dealer.lon);
      if (!best || dist < best.dist) best = { city: known.city, dist };
    }
    return { dealer, city: best && best.dist <= 20 ? best.city : "Інші міста" };
  });

  const groups = new Map<string, Dealer[]>();
  for (const { dealer, city } of resolved) {
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city)!.push(dealer);
  }
  return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0], "uk"));
}

export default function DealersList({ dealers }: { dealers: Dealer[] }) {
  const [query, setQuery] = useState("");
  const grouped = useMemo(() => groupByCity(dealers), [dealers]);
  const filtered = useMemo(() => {
    if (!query.trim()) return grouped;
    const q = query.trim().toLowerCase();
    return grouped
      .map(([city, list]) => [city, list.filter((d) => d.name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q))] as [string, Dealer[]])
      .filter(([city, list]) => city.toLowerCase().includes(q) || list.length > 0);
  }, [grouped, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук міста або дилера..."
        className="w-full max-w-sm rounded-lg border border-navy-dim/30 bg-panel px-4 py-2.5 text-sm outline-none focus:border-gold"
      />

      <div className="mt-8 space-y-10">
        {filtered.map(([city, list]) => (
          <div key={city}>
            <h3 className="font-serif text-lg font-bold text-gold-dim">
              {city} <span className="text-sm font-normal text-navy-dim">({list.length})</span>
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((d, i) => (
                <div key={`${d.name}-${i}`} className="rounded-lg bg-panel-alt p-4">
                  <p className="font-serif font-bold text-navy-dark">{d.name}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-navy-dim hover:text-gold-dim"
                  >
                    {d.address}
                  </a>
                  <div className="mt-2 flex flex-col gap-0.5 text-sm">
                    {d.phones.map((phone, j) => (
                      <a key={phone} href={`tel:${d.phonesTel[j]}`} className="text-navy hover:text-gold-dim">
                        {phone}
                      </a>
                    ))}
                  </div>
                  {d.sites && d.sites.length > 0 && (
                    <a
                      href={d.sites[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm text-navy hover:text-gold-dim"
                    >
                      {d.sitesLabel?.[0] ?? d.sites[0]}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-navy-dim">Нічого не знайдено</p>}
      </div>
    </div>
  );
}
