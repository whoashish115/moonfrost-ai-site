import { BENCHMARKS, CAPABILITY, LANDSCAPE, PARAMETER_SHARE } from "@/lib/content";
import { LOSS_CURVES, type Curve } from "@/lib/curves";

/**
 * Drawn as inline SVG rather than shipped as images, so every line takes its colour from
 * the same custom properties as the rest of the page and both themes work without a second
 * asset. No chart library: three shapes each, and a library would weigh more than the page.
 */

const INK = "var(--text-faint)";
const PINK = "var(--pink)";

/** Grouped bars, one group per benchmark, with the chance line drawn across each. */
export function BenchmarkChart() {
  const width = 720;
  const height = 300;
  const pad = { left: 34, right: 12, top: 16, bottom: 46 };
  const plot = { w: width - pad.left - pad.right, h: height - pad.top - pad.bottom };
  const groups = BENCHMARKS.rows.length;
  const series = BENCHMARKS.columns.length;
  const groupWidth = plot.w / groups;
  const barWidth = (groupWidth * 0.74) / series;
  const shades = ["var(--bar-0)", "var(--bar-0-mid)", PINK,
                  "var(--bar-3)", "var(--bar-2)", "var(--bar-1)"];
  const y = (value: number) => pad.top + plot.h - (value / 80) * plot.h;

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img"
           aria-label="Five-shot accuracy on six benchmarks for Moonfrost and three reference models">
        {[0, 20, 40, 60, 80].map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)}
                  stroke="var(--border)" strokeWidth="1" />
            <text x={pad.left - 7} y={y(tick) + 3.5} textAnchor="end"
                  fill={INK} fontSize="10">{tick}</text>
          </g>
        ))}

        {BENCHMARKS.rows.map((row, groupIndex) => {
          const x0 = pad.left + groupIndex * groupWidth + groupWidth * 0.13;
          return (
            <g key={row.name}>
              {row.scores.map((score, index) => (
                <rect key={BENCHMARKS.columns[index]}
                      x={x0 + index * barWidth} y={y(score)}
                      width={barWidth * 0.88} height={plot.h - (y(score) - pad.top)}
                      fill={shades[index]} rx="2">
                  <title>{`${BENCHMARKS.columns[index]} on ${row.name}: ${score}%`}</title>
                </rect>
              ))}
              {/* chance decides whether a score means anything at all */}
              <line x1={x0 - 4} x2={x0 + groupWidth * 0.78}
                    y1={y(row.chance)} y2={y(row.chance)}
                    stroke="var(--danger)" strokeWidth="1.4" strokeDasharray="4 3" />
              <text x={pad.left + groupIndex * groupWidth + groupWidth / 2}
                    y={height - pad.bottom + 16} textAnchor="middle"
                    fill="var(--text-muted)" fontSize="10.5">{row.name}</text>
            </g>
          );
        })}
      </svg>

      <figcaption className="legend">
        {BENCHMARKS.columns.map((column, index) => (
          <span key={column}>
            <i style={{ background: shades[index] }} />
            {column}
          </span>
        ))}
        <span className="chance-key">
          <i className="dash" />
          chance
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * The three training stages, one panel each.
 *
 * They deliberately do not share an axis: every stage restarts its step counter and the
 * fine-tune runs at a different batch size, so a single joined curve would describe a run
 * that never happened. Train loss is the faint line, validation the solid one, and the
 * marked point is the best validation loss, which is the checkpoint that was released.
 */
export function LossChart() {
  const width = 300;
  const height = 190;
  const pad = { left: 40, right: 12, top: 14, bottom: 30 };

  return (
    <div className="loss-grid">
      {LOSS_CURVES.map((stage) => {
        const points = stage.segments.flatMap((s) => [...s.train, ...s.val]);
        const steps = points.map(([step]) => step);
        const losses = points.map(([, loss]) => loss);
        const x0 = Math.min(...steps);
        const x1 = Math.max(...steps);
        // a clipped panel drops the opening cliff, which would otherwise flatten the rest
        const lo = stage.clip ? stage.clip.low : Math.min(...losses);
        const hi = stage.clip ? stage.clip.high : Math.max(...losses);
        const span = hi - lo || 1;

        const px = (step: number) =>
          pad.left + ((step - x0) / (x1 - x0 || 1)) * (width - pad.left - pad.right);
        const py = (loss: number) =>
          height - pad.bottom -
          ((loss - (lo - span * 0.08)) / (span * 1.16)) * (height - pad.top - pad.bottom);
        const path = (curve: Curve) =>
          curve
            .filter(([, loss]) => loss <= hi)
            .map(([step, loss], i) => `${i ? "L" : "M"}${px(step).toFixed(1)} ${py(loss).toFixed(1)}`)
            .join(" ");

        // the unlogged middle of phase 1, drawn rather than quietly closed over
        const gaps = stage.segments.slice(1).map((segment, index) => {
          const before = stage.segments[index].train;
          return [before[before.length - 1][0], segment.train[0][0]] as const;
        });

        const ticks = [lo, lo + span / 2, hi].map((v) => Number(v.toFixed(2)));
        const best = stage.segments
          .flatMap((s) => s.val)
          .reduce((a, b) => (b[1] < a[1] ? b : a), [0, Infinity] as [number, number]);

        return (
          <figure className="chart loss-panel" key={stage.title}>
            <figcaption className="loss-title">{stage.title}</figcaption>
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={stage.title}>
              {ticks.map((tick) => (
                <g key={tick}>
                  <line x1={pad.left} x2={width - pad.right} y1={py(tick)} y2={py(tick)}
                        stroke="var(--border)" strokeWidth="1" />
                  <text x={pad.left - 6} y={py(tick) + 3.5} textAnchor="end" fill={INK}
                        fontSize="9">{tick}</text>
                </g>
              ))}

              {gaps.map(([from, to]) => (
                <g key={from}>
                  <rect x={px(from)} y={pad.top} width={px(to) - px(from)}
                        height={height - pad.top - pad.bottom}
                        fill="var(--text-faint)" opacity="0.13" />
                  <text x={(px(from) + px(to)) / 2} y={pad.top + 12} textAnchor="middle"
                        fill="var(--text-muted)" fontSize="9">not logged</text>
                </g>
              ))}

              {stage.segments.map((segment, index) => (
                <g key={index}>
                  <path d={path(segment.train)} fill="none" stroke="var(--text-muted)"
                        strokeWidth="1" opacity="0.45" />
                  <path d={path(segment.val)} fill="none" stroke={PINK} strokeWidth="1.8"
                        strokeLinejoin="round" />
                </g>
              ))}

              <circle cx={px(best[0])} cy={py(best[1])} r="3.4" fill={PINK}
                      stroke="var(--bg)" strokeWidth="1.4" />
              <text x={px(best[0])} y={py(best[1]) - 8} textAnchor="middle" fill={PINK}
                    fontSize="9.5" fontWeight="700">{best[1].toFixed(4)}</text>

              {stage.clip ? (
                <text x={pad.left + 4} y={pad.top + 9} fill="var(--text-muted)" fontSize="9">
                  {stage.clip.opens}
                </text>
              ) : null}

              <text x={(width + pad.left - pad.right) / 2} y={height - 4} textAnchor="middle"
                    fill={INK} fontSize="9">step</text>
            </svg>
            <p className="loss-note">{stage.note}</p>
          </figure>
        );
      })}
    </div>
  );
}

/** Parameters against tokens, both on log scales, with the compute-optimal line. */
