type Layer = { label: string; value: string };

const LAYER_COLORS = [
  "bg-[#b98a52]", // дерев'яний брус
  "bg-[#d9c9a3]", // сотовий наповнювач
  "bg-[#8a7a68]", // МДФ
  "bg-[#b8bfc7]", // алюмінієвий молдинг
  "bg-navy-dark", // ПВХ-плівка (зовнішній шар)
];

export default function ConstructionDiagram({
  title,
  subtitle,
  layers,
  featuresTitle,
  features,
  dimensionsTitle,
  dimensions,
}: {
  title: string;
  subtitle: string;
  layers: Layer[];
  featuresTitle: string;
  features: string[];
  dimensionsTitle: string;
  dimensions: string[];
}) {
  return (
    <section className="rounded-2xl bg-navy-dark p-6 text-white sm:p-10">
      <h2 className="font-serif text-2xl font-bold text-gold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{subtitle}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Пошарова схема полотна */}
        <div className="mx-auto w-full max-w-xs">
          {layers.map((layer, i) => (
            <div
              key={layer.label}
              className="flex items-center gap-4"
              style={{ marginLeft: `${i * 18}px`, marginTop: i === 0 ? 0 : "-6px" }}
            >
              <div
                className={`h-10 flex-1 rounded-md border border-white/15 shadow-lg ${LAYER_COLORS[i % LAYER_COLORS.length]}`}
              />
              <div className="w-40 shrink-0 text-xs">
                <p className="font-semibold text-white">{layer.label}</p>
                {layer.value && <p className="text-white/60">{layer.value}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Особливості та розміри */}
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-dim">{featuresTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold">✔</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-dim">{dimensionsTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {dimensions.map((d) => (
                <li key={d}>— {d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
