"use client";

import Link from "next/link";
import style from "./main.module.scss";
import { Button } from "./_components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Hbg from "../public/home-bg.svg";

const topSpaces = [
  { title: "Salary and Finance", to: "space/1" },
  { title: "Human Resource", to: "space/2" },
  { title: "Code of conduct", to: "space/3" },
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
              key={item.title}
              size="bwide"
              color="white"
              onClick={handleToSpaces(item.to)}
              variant="filled"
              custom="text-text font-geo"
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
        <Image src={Hbg} priority alt="" />
      </div>
    </main>
  );
}
