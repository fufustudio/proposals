import {
  Hanken_Grotesk,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const fontClassName = [
  instrumentSerif.variable,
  hankenGrotesk.variable,
  jetBrainsMono.variable,
].join(" ");
