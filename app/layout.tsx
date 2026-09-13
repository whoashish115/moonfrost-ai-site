import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import { SITE } from "@/lib/content";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Outfit({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} - a 777M Mixture-of-Experts language model trained from scratch`,
  description: SITE.description,
  authors: [{ name: SITE.author }],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/icons/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} - a 777M Mixture-of-Experts language model trained from scratch`,
    description: SITE.description,
    url: SITE.url,
    images: [
      {
        url: "/icons/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "The Moonfrost mark: a pink cat curled up asleep",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} - a 777M Mixture-of-Experts language model trained from scratch`,
    description: SITE.description,
    images: ["/icons/android-chrome-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#c2428f",
  width: "device-width",
  initialScale: 1,
};

/**
 * Applied before the body paints, so a remembered theme never flashes the other one on
 * load. It has to be inline for that: anything loaded as a module runs too late.
 */
const THEME_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem("moonfrost-theme");
    if (saved === "dark" || saved === "light") {
      document.documentElement.dataset.theme = saved;
    }
  } catch (error) {}
})();
`;

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  codeRepository: "https://github.com/whoashish115/moonfrost-ai",
  programmingLanguage: "Python",
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  author: { "@type": "Person", name: SITE.author },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
