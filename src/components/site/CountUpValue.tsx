import { useEffect, useRef, useState } from "react";

const COUNT_UP_MS = 3_000;

function parseMetricValue(value: string) {
  const match = value.trim().match(/(\d[\d,]*)(.*)/);
  if (!match?.[1]) return null;
  const num = Number(match[1].replace(/,/g, ""));
  if (Number.isNaN(num)) return null;
  return { num, suffix: match[2] ?? "" };
}

export function CountUpValue({
  value,
  delay = 0,
}: {
  value: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parseMetricValue(value);
  const target = parsed?.num;
  const suffix = parsed?.suffix ?? "";
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target == null) return;
    const el = ref.current;
    if (!el) return;

    let scheduled = false;
    let started = false;
    let raf = 0;
    let timeout = 0;

    const run = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / COUNT_UP_MS, 1);
        setDisplay(Math.round(target * p));
        if (p < 1) raf = requestAnimationFrame(tick);
        else setDisplay(target);
      };
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (scheduled) return;
      scheduled = true;
      timeout = window.setTimeout(run, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        start();
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      start();
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [delay, target]);

  if (target == null) return <>{value}</>;

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("ko-KR")}
      {suffix ? <span className="text-metric-accent">{suffix}</span> : null}
    </span>
  );
}
