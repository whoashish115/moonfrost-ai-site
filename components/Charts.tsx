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
