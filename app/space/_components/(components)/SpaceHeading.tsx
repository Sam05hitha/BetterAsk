import React from "react";
import style from "../../[spaceId]/space.module.scss";
import Link from "next/link";

type TSpaceHeading = {
  title: string;
  link: string;
};

export default function SpaceHeading({ title, link }: TSpaceHeading) {
  return (
    <div className={`${style.space_heading} font-geo`}>
      <h3>{title}</h3>
      <Link href={link} className=" text-text-100 underline">
        View documents
      </Link>
    </div>
  );
}
