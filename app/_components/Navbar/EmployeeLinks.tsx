import Link from "next/link";
import React from "react";
import style from "./navbar.module.scss";
import { usePathname } from "next/navigation";
import NavProfile from "./NavProfile";

const links = [{ title: "View spaces", to: "/spaces" }];

export default function EmployeeLinks() {
  const pathname = usePathname();

  return (
    <div className={`${style.sml_links_container} font-geo`}>
      {links.map((item) => (
        <Link className="text-xl underline" key={item.title} href={item.to}>
          {item.title}
        </Link>
      ))}
      <NavProfile username="Thomas Ed." role="Space user" />
    </div>
  );
}
