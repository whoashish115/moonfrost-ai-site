<p align="center"><img src="public/logo.png" width="112" alt="Moonfrost AI logo"></p>

<h1 align="center">Moonfrost AI site</h1>

<p align="center"><a href="https://moonfrost-ai.vercel.app"><b>Site</b></a> ·
<a href="https://github.com/whoashish115/moonfrost-ai">Main repo</a> ·
<a href="https://huggingface.co/whoashish115/Moonfrost-777M">Base</a> ·
<a href="https://huggingface.co/whoashish115/Moonfrost-777M-Instruct-v2">Instruct v2</a> ·
<a href="https://huggingface.co/spaces/whoashish115/moonfrost-ai-chat">Demo</a></p>

Source of the site for `Moonfrost-777M`, a 777M-parameter Mixture-of-Experts language model trained
from scratch: the architecture, the training record with loss curves, the measured benchmarks against
three reference models, the full specification and the links. Every figure is drawn as inline SVG, so
both themes work from one set of tokens and the page ships no chart library.

## Data

This repository holds no measurements of its own. `lib/content.ts` and `lib/curves.ts` are generated in the
[main repository](https://github.com/whoashish115/moonfrost-ai), where every number comes from `docs/eval*.json`
and `docs/logs/`:

```bash
# in a checkout of moonfrost-ai, with this repository next to it
python training/sync_benchmarks.py     # benchmark tables, from docs/eval*.json
python training/export_curves.py       # loss curves, from docs/logs/*.jsonl
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

Next.js 16 (static export), React 19, TypeScript. Deployed on Vercel from `main`.

## License

Apache-2.0, Copyright 2026 Ashish Kumar. The full text is in [LICENSE](LICENSE).
