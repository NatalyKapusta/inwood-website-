export type SalaryMode = "percent" | "split" | "plan" | "manual";

export const salaryModeLabels: Record<SalaryMode, string> = {
  percent: "Відсоток від суми",
  split: "Нові / старі за різним %",
  plan: "План (% якщо виконано)",
  manual: "Вручну",
};

export type SalaryOrder = {
  id: string;
  order_date: string | null;
  comment: string;
  amount: number;
  kind: "new" | "old";
  sort_order: number;
};

export type SalaryPerson = {
  id: string;
  period: string;
  name: string;
  note: string;
  mode: SalaryMode;
  rate: number;
  rate_new: number;
  rate_old: number;
  plan_target: number;
  plan_met: boolean;
  manual_amount: number;
  sort_order: number;
  orders: SalaryOrder[];
};

export function salesTotal(p: SalaryPerson): number {
  return p.orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
}

export function newOldSums(p: SalaryPerson): { newSum: number; oldSum: number } {
  let newSum = 0;
  let oldSum = 0;
  for (const o of p.orders) {
    const v = Number(o.amount) || 0;
    if (o.kind === "old") oldSum += v;
    else newSum += v;
  }
  return { newSum, oldSum };
}

export function planIsMet(p: SalaryPerson): boolean {
  if (Number(p.plan_target) > 0) return salesTotal(p) >= Number(p.plan_target);
  return !!p.plan_met;
}

export function commissionOf(p: SalaryPerson): number {
  const total = salesTotal(p);
  switch (p.mode) {
    case "percent":
      return (total * (Number(p.rate) || 0)) / 100;
    case "split": {
      const { newSum, oldSum } = newOldSums(p);
      return (newSum * (Number(p.rate_new) || 0)) / 100 + (oldSum * (Number(p.rate_old) || 0)) / 100;
    }
    case "plan":
      return planIsMet(p) ? (total * (Number(p.rate) || 0)) / 100 : Number(p.manual_amount) || 0;
    case "manual":
      return Number(p.manual_amount) || 0;
  }
}

export function fmtMoney(n: number): string {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(Number(n) || 0) + " ₴";
}

export function fmtPct(n: number): string {
  const v = Number(n) || 0;
  return (Math.round(v * 100) / 100).toString() + "%";
}
