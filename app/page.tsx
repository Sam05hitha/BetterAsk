"use client";

import Link from "next/link";
import style from "./main.module.scss";
import { Button } from "./_components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Hbg from "../public/home-bg.svg";

const topSpaces = [
  { title: "Salary and Finance" },
  { title: "Human Resource" },
  { title: "Code of conduct" },
];

export default function Home() {
  const router = useRouter();

  function handleToSpaces(path: string) {
    const to = `/${path}`;
    return () => {
      router.push(to);
    };
  }

  return (
    <main className={`${style.home_container} bg-primary`}>
      <h1 className="font-inria text-5xl ">BetterAsk</h1>

      <div className={style.home_spaces}>
        <div>
          {topSpaces.map((item) => (
            <Button
              custom="text-black font-geo"
              key={item.title}
              size="bwide"
              color="white"
              onClick={handleToSpaces("")}
              variant="filled"
            >
              {item.title}
            </Button>
          ))}
        </div>
        <Link className="text-white text-lg  underline font-geo" href={""}>
          view more
        </Link>
      </div>
      <div className={style.home_bgImage}>
        <Image src={Hbg} alt="" />
      </div>
    </main>
  );
}
