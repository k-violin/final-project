import { useQuery } from "@tanstack/react-query";

import { CountUpValue } from "./CountUpValue";
import { fetchTrustMetrics } from "@/lib/db";

export function TrustMetricsBar() {
  const { data: metrics } = useQuery({ queryKey: ["trust-metrics"], queryFn: fetchTrustMetrics });

  return (
    <section aria-label="주요 지표" className="border-b border-border bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4 md:py-16">
        {(metrics ?? []).map((m, i) => (
          <div key={m.id} className="text-center">
            <p className="text-3xl font-bold text-primary md:text-4xl">
              <CountUpValue value={m.value} delay={i * 80} />
            </p>
            <span className="mx-auto mt-2.5 block h-0.5 w-8 rounded-full bg-metric-accent" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
