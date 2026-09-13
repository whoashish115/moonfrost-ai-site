import Image from "next/image";

import {
  BenchmarkChart,
  CapabilityChart,
  LossChart,
  ParameterShare,
  ScaleChart,
} from "@/components/Charts";
import Nav from "@/components/Nav";
import {
  BENCHMARKS,
  HEADLINE_STATS,
  IDEAS,
  LINKS,
  RESOURCE_GROUPS,
  SITE,
  SPEC,
  TRAINING_STAGES,
} from "@/lib/content";

/** The winning score in each benchmark row, so the table can mark it without hardcoding. */
function bestIndex(scores: number[]) {
  return scores.indexOf(Math.max(...scores));
}

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top">
        <div className="wrap">
          <div className="hero">
            <Image src="/logo.png" alt="" width={128} height={104} priority className="hero-mark" />
            <span className="eyebrow">777M parameters &middot; 161M active per token</span>
            <h1>
              A language model
              <br />
              built from <em>nothing</em>.
            </h1>
            <p className="lede">{SITE.tagline.replace(/\.$/, "")}: tokenizer, attention, expert
              routing, training loop and chat server, all written from scratch and trained on
              rented GPU time. No fine-tuned base, no borrowed weights, no framework doing the
              hard part.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={LINKS.github} target="_blank" rel="noopener">
                GitHub repository
              </a>
              <a className="btn btn-ghost" href={LINKS.instruct} target="_blank" rel="noopener">
                Download the model
              </a>
            </div>
          </div>

          <dl className="stats">
            {HEADLINE_STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <dd>{stat.value}</dd>
                <dt>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <section id="architecture">
          <div className="wrap">
            <h2>Two ideas, one engineering fix</h2>
            <p className="sub">
              The architecture follows DeepSeek-V2: attention that compresses what it caches,
              and feed-forward layers where only a few experts fire for any given token. The
              third card is not a modelling idea at all, and without it the first two would
              still be training.
            </p>
            <div className="cards">
              {IDEAS.map((idea) => (
                <article className="card" key={idea.number}>
                  <span className="card-num">{idea.number}</span>
                  <h3>{idea.title}</h3>
                  <p>{idea.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="training">
          <div className="wrap">
            <h2>Twelve GPU-hours, split across two machines</h2>
            <p className="sub">
              The two pretraining phases ran on separate machines. The learning rate is
              parameterised by elapsed fraction of training rather than by step, so the
              second resumed at 0.5227 and the cosine curve continued rather than
              restarting. Only the weights crossed the boundary.
            </p>
            <div className="scroll-x">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Stage</th>
                    <th scope="col" className="num">Minutes</th>
                    <th scope="col" className="num">Tokens</th>
                    <th scope="col" className="num">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAINING_STAGES.map((row) => (
                    <tr key={row.stage}>
                      <td>{row.stage}</td>
                      <td className="num">{row.minutes}</td>
                      <td className="num">{row.tokens}</td>
                      <td className="num">{row.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <LossChart />
          </div>
        </section>

        <section id="results">
          <div className="wrap">
            <h2>What it scores, and why</h2>
            <p className="sub">
              Five-shot, 250 examples per benchmark, every model run through the same
              harness on the same items. All three Moonfrost checkpoints are shown, so the
              effect of instruction tuning can be read rather than assumed. One benchmark
              moves: ARC-Easy falls 54.8, 52.4, 44.4 across the base and the two tunes.
              Every other gap is inside the noise at this sample size. Figures copied from
              other model cards would compare harnesses as much as models: Qwen2.5-0.5B
              publishes 47.5 on MMLU and scores 34.4 here.
            </p>
            <BenchmarkChart />
            <div className="scroll-x">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Benchmark</th>
                    <th scope="col" className="num">Chance</th>
                    {BENCHMARKS.columns.map((column) => (
                      <th scope="col" className="num" key={column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARKS.rows.map((row) => {
                    const best = bestIndex(row.scores);
                    return (
                      <tr key={row.name}>
                        <th scope="row">{row.name}</th>
                        <td className="num faint">{row.chance.toFixed(1)}</td>
                        {row.scores.map((score, index) => (
                          <td
                            className={`num${index === 0 ? " ours" : ""}${index === best ? " best" : ""}`}
                            key={BENCHMARKS.columns[index]}
                          >
                            {score.toFixed(1)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="sub note">
              Moonfrost is last or near-last on most rows, and the architecture is not the
              reason. Six billion tokens for 777 million parameters is about eight tokens per
              parameter, against a compute-optimal ratio of roughly twenty and against
              reference models that read two to eighteen trillion at half the size. The budget
              bought behaviour rather than knowledge: it holds a conversation and writes short
              working code, but it does not know much.
            </p>
            <ScaleChart />

            <h3 className="chart-heading">Where it sits against everything else</h3>
            <p className="sub">
              MMLU is the one score published widely enough to put open and closed models on
              a single axis, which is the only way GPT-4, Claude and Gemini can appear at all:
              none of them has published a parameter count or a token budget, so they cannot
              be placed on the chart above. Bars marked <b>here</b> were measured on this
              machine; the rest are each developer&rsquo;s own five-shot figure.
            </p>
            <CapabilityChart />
          </div>
        </section>

        <section id="spec">
          <div className="wrap">
            <h2>Specification</h2>
            <p className="sub">
              Seventy per cent of the model is experts that stay idle for any given token.
              That is the whole trade: the capacity of a 777M model at roughly the compute of
              a 161M one.
            </p>
            <ParameterShare />
            <div className="scroll-x spec-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Property</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {SPEC.map(([property, value]) => (
                    <tr key={property}>
                      <th scope="row">{property}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="links">
          <div className="wrap">
            <h2>Everything, in one place</h2>
            <p className="sub">
              Weights, code, training data and the raw run logs are all public, including the
              parts that did not work.
            </p>
            {RESOURCE_GROUPS.map((group) => (
              <div className="group" key={group.heading}>
                <div className="group-head">
                  <h3>{group.heading}</h3>
                  <p>{group.note}</p>
                  {"all" in group && group.all ? (
                    <a href={group.all.href} target="_blank" rel="noopener">
                      {group.all.label} <span aria-hidden="true">&#8599;</span>
                    </a>
                  ) : null}
                </div>
                <div className="cards">
                  {group.items.map((item) => (
                    <a
                      className="card link-card"
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener"
                    >
                      <span className="card-num">{item.tag}</span>
                      <h4>
                        {item.title} <span aria-hidden="true">&#8599;</span>
                      </h4>
                      <p>{item.body}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <span>Moonfrost AI &middot; Apache 2.0</span>
          <span className="spacer" />
          <a href={LINKS.base} target="_blank" rel="noopener">Base</a>
          <a href={LINKS.instruct} target="_blank" rel="noopener">Instruct</a>
          <a href={LINKS.dataset} target="_blank" rel="noopener">Dataset</a>
          <a href={LINKS.site} target="_blank" rel="noopener">This site</a>
        </div>
      </footer>
    </>
  );
}
