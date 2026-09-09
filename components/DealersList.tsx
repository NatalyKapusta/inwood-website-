"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { groupByCity, CITY_SLUGS, type Dealer } from "@/lib/dealers";

export default function DealersList({ dealers, locale }: { dealers: Dealer[]; locale: string }) {
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
              {CITY_SLUGS[city] ? (
                <Link href={`/${locale}/nashi-dileri/${CITY_SLUGS[city]}`} className="hover:text-gold">
                  {city}
                </Link>
              ) : (
                city
              )}{" "}
              <span className="text-sm font-normal text-navy-dim">({list.length})</span>
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
