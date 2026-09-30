# Moonfrost Site

The project page for [Moonfrost](https://github.com/whoashish115/moonfrost-ai), a
777M-parameter Mixture-of-Experts language model built and trained from scratch. Live at
[moonfrost-ai.vercel.app](https://moonfrost-ai.vercel.app).

Next.js with the App Router and TypeScript, exported as static HTML.

## Run

```bash
npm install
npm run dev
```

```bash
npm run build        # static export into out/
```

## Layout

```
moonfrost-site/
├── app/
│   ├── layout.tsx      metadata, fonts, the pre-paint theme script
│   ├── page.tsx        the page
│   └── globals.css     tokens and every rule
├── components/
│   ├── Nav.tsx         header, section links, project icons
│   ├── Charts.tsx      benchmark bars, loss panels, the scale scatter, parameter share
│   ├── Icons.tsx       GitHub, Hugging Face, Weights & Biases
│   ├── AboutDialog.tsx the info panel
│   └── ThemeToggle.tsx the only client component on the page
├── lib/
│   ├── content.ts      every number and link the page shows
│   └── curves.ts       loss curves, generated from the training logs
├── public/
│   ├── logo.png
│   └── icons/          favicon set and the web manifest
├── next.config.ts
└── package.json
```

## License

Apache 2.0, Copyright 2026 Ashish Kumar. The full text is in [LICENSE](LICENSE).

