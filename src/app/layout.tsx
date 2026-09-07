import type { Metadata } from "next";
import { Inter, Outfit, Michroma, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit-custom",
  subsets: ["latin"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: ["400"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.visionatrix.site"),
  title: {
    default: "VISIONATRIX | Creative Technology & Interactive Digital Studio",
    template: "%s | VISIONATRIX TECHNOLOGIES",
  },
  description:
    "VISIONATRIX TECHNOLOGIES is a premier creative technology studio engineering sensory architecture, high-fidelity WebGL interactive ecosystems, CGI advertising, and 3D visual FX.",
  keywords: [
    "VISIONATRIX TECHNOLOGIES",
    "VISIONATRIX",
    "Creative Technology Studio",
    "Sensory Architecture",
    "Interactive 3D WebGL",
    "CGI Advertising",
    "VFX Simulations",
    "Next.js Web Development",
    "Yuvraj Rathod",
  ],
  authors: [{ name: "Yuvraj Rathod", url: "https://www.visionatrix.site/" }],
  creator: "Yuvraj Rathod",
  publisher: "VISIONATRIX TECHNOLOGIES",
  alternates: {
    canonical: "https://www.visionatrix.site/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "VISIONATRIX | Creative Technology & Interactive Digital Studio",
    description:
      "VISIONATRIX TECHNOLOGIES is a premier creative technology studio engineering sensory architecture, high-fidelity WebGL interactive ecosystems, CGI advertising, and 3D visual FX.",
    url: "https://www.visionatrix.site/",
    siteName: "VISIONATRIX TECHNOLOGIES",
    images: [
      {
        url: "https://www.visionatrix.site/LOGO.png",
        width: 800,
        height: 800,
        alt: "VISIONATRIX Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VISIONATRIX | Creative Technology & Interactive Digital Studio",
    description:
      "VISIONATRIX TECHNOLOGIES is a premier creative technology studio engineering sensory architecture, high-fidelity WebGL interactive ecosystems, CGI advertising, and 3D visual FX.",
    images: ["https://www.visionatrix.site/LOGO.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VISIONATRIX TECHNOLOGIES",
  "url": "https://www.visionatrix.site/",
  "logo": "https://www.visionatrix.site/LOGO.png",
  "founder": {
    "@type": "Person",
    "name": "Yuvraj Rathod",
  },
  "description":
    "Creative technology studio engineering sensory architecture, interactive WebGL experiences, CGI advertising, and 3D digital environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${michroma.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0b0f] text-white">
        <div className="noise-overlay" />
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}

