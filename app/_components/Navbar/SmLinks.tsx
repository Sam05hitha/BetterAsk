import Link from "next/link";
import React from "react";
import style from "./navbar.module.scss";
import { usePathname } from "next/navigation";
import NavProfile from "./NavProfile";

const links = [
  { title: "Manage spaces", to: "/spaces" },
  { title: "Manage documents", to: "/manage_documents" },
  { title: "Manage users", to: "/manage_users" },
];

export default function SmLinks() {
  const pathname = usePathname();

  return (
    <div className={`${style.sml_links_container} font-geo`}>
      {links.map((item) => (
        <Link className="text-xl underline" key={item.title} href={item.to}>
          {item.title}
        </Link>
      ))}
      <NavProfile username="Thomas Ed." role="space manager" />
    </div>
  );
}
