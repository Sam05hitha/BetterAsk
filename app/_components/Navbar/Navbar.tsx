"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import style from "./navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();
  const hasNav = ["/login", "/Signup"].includes(pathname);

  return (
    !hasNav && (
      <nav className={`${style.nav_container} bg-secondary`}>
        <header className="font-geo font-extrabold text-3xl">
          <Link href="/">BetterAsk</Link>
        </header>
        {/* <SmLinks /> */}
        {/* <EmployeeLinks /> */}
        {/* <LogButtons handleSignIn={handleSignIn} /> */}
      </nav>
    )
  );
}
