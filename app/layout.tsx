import type { Metadata } from "next";
import { Inter, Inria_Sans, Geo } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const inria = Inria_Sans({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-inria",
});
const geo = Geo({ weight: "400", subsets: ["latin"], variable: "--font-geo" });

export const metadata: Metadata = {
  title: "BetterAsk",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body
          className={`${inter.className} ${inria.variable} ${geo.variable}`}
        >
          {children}
        </body>
      </html>
  );
}
