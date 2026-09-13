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
export function ScaleChart() {
  const width = 720;
  const height = 330;
  const pad = { left: 46, right: 92, top: 18, bottom: 40 };
  const xMin = 7.9;   // 1e7.9 parameters
  const xMax = 12.1;
  const yMin = 9.4;
  const yMax = 13.6;
  const px = (value: number) =>
    pad.left + ((Math.log10(value) - xMin) / (xMax - xMin)) * (width - pad.left - pad.right);
  const py = (value: number) =>
    height - pad.bottom - ((Math.log10(value) - yMin) / (yMax - yMin)) * (height - pad.top - pad.bottom);

  const tick = (value: number) =>
    value >= 1e12 ? `${value / 1e12}T` : value >= 1e9 ? `${value / 1e9}B` : `${value / 1e6}M`;

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img"
           aria-label="Model size against training tokens on log scales, with Moonfrost far below the compute-optimal line">
        {[1e8, 1e9, 1e10, 1e11, 1e12].map((value) => (
          <g key={`x${value}`}>
            <line x1={px(value)} x2={px(value)} y1={pad.top} y2={height - pad.bottom}
                  stroke="var(--border)" strokeWidth="1" />
            <text x={px(value)} y={height - pad.bottom + 15} textAnchor="middle"
                  fill={INK} fontSize="10">{tick(value)}</text>
          </g>
        ))}
        {[1e10, 1e11, 1e12, 1e13].map((value) => (
          <g key={`y${value}`}>
            <line x1={pad.left} x2={width - pad.right} y1={py(value)} y2={py(value)}
                  stroke="var(--border)" strokeWidth="1" />
            <text x={pad.left - 7} y={py(value) + 3.5} textAnchor="end"
                  fill={INK} fontSize="10">{tick(value)}</text>
          </g>
        ))}

        {/* twenty tokens per parameter: roughly where a model is trained as much as its size justifies */}
        <line x1={px(10 ** xMin)} y1={py(10 ** xMin * 20)}
              x2={px(10 ** xMax)} y2={py(10 ** xMax * 20)}
              stroke="var(--text-muted)" strokeWidth="1.2" strokeDasharray="5 4" />
        <text x={width - pad.right - 4} y={py(10 ** xMax * 20) - 8} textAnchor="end"
              fill="var(--text-muted)" fontSize="10">20 tokens per parameter</text>

        {LANDSCAPE.map((model) => (
          <g key={model.name}>
            <circle cx={px(model.params)} cy={py(model.tokens)}
                    r={model.ours ? 6.5 : 4} fill={model.ours ? PINK : INK}
                    stroke="var(--bg)" strokeWidth={model.ours ? 2 : 0} />
            <text x={px(model.params) + (model.ours ? 11 : 8)} y={py(model.tokens) + 3.5}
                  fill={model.ours ? PINK : "var(--text-muted)"} fontSize="10"
                  fontWeight={model.ours ? 700 : 400}>{model.name}</text>
          </g>
        ))}

        <text x={(width - pad.right + pad.left) / 2} y={height - 4} textAnchor="middle"
              fill={INK} fontSize="10">parameters</text>
        <text x={12} y={height / 2} textAnchor="middle" fill={INK} fontSize="10"
              transform={`rotate(-90 12 ${height / 2})`}>training tokens</text>
      </svg>
    </figure>
  );
}

/** Where the parameters sit, as one stacked bar. */
export function ParameterShare() {
  let offset = 0;
  const shades = [PINK, "var(--bar-3)", "var(--bar-2)", "var(--bar-1)"];
  return (
    <figure className="chart share">
      <svg viewBox="0 0 720 44" role="img"
           aria-label="Seventy per cent of the parameters are routed experts">
        {PARAMETER_SHARE.map((part, index) => {
          const w = (part.share / 100) * 720;
          const x = offset;
          offset += w;
          return (
            <rect key={part.part} x={x} y={8} width={w - 2} height={28} rx="3"
                  fill={shades[index]}>
              <title>{`${part.part}: ${part.value}M parameters, ${part.share}%`}</title>
            </rect>
          );
        })}
      </svg>
      <figcaption className="legend">
        {PARAMETER_SHARE.map((part, index) => (
          <span key={part.part}>
            <i style={{ background: shades[index] }} />
            {part.part} <b>{part.share}%</b>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/**
 * Every model on one axis, sorted by MMLU. This is the chart the scale one cannot be:
 * closed models publish a score but never a parameter count, so this is the only place
 * GPT-4, Claude and Gemini can stand next to everything else honestly.
 */
export function CapabilityChart() {
  const rowHeight = 20;
  const labelWidth = 132;
  const valueWidth = 42;
  const width = 720;
  const height = CAPABILITY.length * rowHeight + 26;
  const trackWidth = width - labelWidth - valueWidth - 12;
  const chanceX = labelWidth + (25 / 100) * trackWidth;

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img"
           aria-label="MMLU for 28 models from GPT-2 to o1, with Moonfrost fourth from last">
        {/* chance on a four-option question: below this a score means nothing */}
        <line x1={chanceX} x2={chanceX} y1={4} y2={height - 22}
              stroke="var(--danger)" strokeWidth="1.4" strokeDasharray="4 3" />

        {CAPABILITY.map((model, index) => {
          const y = index * rowHeight + 4;
          const barWidth = (model.mmlu / 100) * trackWidth;
          const fill = model.ours ? "var(--pink)" : model.open ? "var(--bar-1)" : "var(--bar-2)";
          return (
            <g key={model.name}>
              <text x={labelWidth - 9} y={y + 12} textAnchor="end" fontSize="10.5"
                    fill={model.ours ? "var(--pink)" : "var(--text-muted)"}
                    fontWeight={model.ours ? 700 : 400}>
                {model.name}
              </text>
              <rect x={labelWidth} y={y + 3} width={trackWidth} height={rowHeight - 8}
                    rx="3" fill="var(--bg-sunken)" />
              <rect x={labelWidth} y={y + 3} width={barWidth} height={rowHeight - 8}
                    rx="3" fill={fill}>
                <title>{`${model.name} (${model.year}): ${model.mmlu}% MMLU`}</title>
              </rect>
              <text x={labelWidth + trackWidth + 8} y={y + 12} fontSize="10.5"
                    fill={model.ours ? "var(--pink)" : "var(--text)"}
                    fontWeight={model.ours ? 700 : 400}>
                {model.mmlu.toFixed(1)}
              </text>
              {model.here ? (
                <text x={width - 2} y={y + 12} textAnchor="end" fontSize="9"
                      fill="var(--text-faint)">here</text>
              ) : null}
            </g>
          );
        })}

        <text x={chanceX} y={height - 8} textAnchor="middle" fontSize="9.5"
              fill="var(--danger)">chance, 25%</text>
      </svg>

      <figcaption className="legend">
        <span><i style={{ background: "var(--pink)" }} />Moonfrost</span>
        <span><i style={{ background: "var(--bar-1)" }} />open weights</span>
        <span><i style={{ background: "var(--bar-2)" }} />closed</span>
        <span className="chance-key"><i className="dash" />chance</span>
      </figcaption>
    </figure>
  );
}
