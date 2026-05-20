import type { Metadata } from "next";
import { Inter, Outfit, Michroma } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "VISIONATRIX // Creative Technology Studio",
  description: "Sensory Architecture, CGI Advertising, VFX simulations and Premium Digital Environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${michroma.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-white overflow-hidden">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
