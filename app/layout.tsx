import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import { Navbar } from "./_components";
import AppWrap from "./_context/AppWrap";

const geo = Geologica({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-geo",
});

const geoMedium = Geologica({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-medium",
});

const geoBold = Geologica({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-bold",
});

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
        className={`${geo.className} ${geoBold.variable} ${geoMedium.variable}`}
      >
        {/* <Navbar /> */}
        <AppWrap>{children}</AppWrap>
      </body>
    </html>
  );
}
