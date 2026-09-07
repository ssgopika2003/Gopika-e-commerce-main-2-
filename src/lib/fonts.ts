import { Cabin, IBM_Plex_Mono, Outfit } from "next/font/google";
import localFont from "next/font/local";

export const fontCabin = Cabin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cabin",
});

export const fontOutfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const fontMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const fontNickainley = localFont({
  src: "../assets/fonts/Nickainley.ttf",
  variable: "--font-nickainley",
  display: "swap",
});
