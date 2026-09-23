export default function SpecsTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-xl bg-panel-alt p-6">
      <h2 className="font-serif text-lg font-bold text-navy-dark">{title}</h2>
      <dl className="mt-4 divide-y divide-navy-dim/10">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_1.4fr] gap-4 py-3 text-sm sm:grid-cols-[1fr_1.6fr]">
            <dt className="text-navy-dim">{row.label}</dt>
            <dd className="text-navy-dark">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
