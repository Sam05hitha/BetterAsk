import { PageHeadingTab, Table } from "@/app/_components";
import React from "react";
import style from "../../main.module.scss";

const data = [
  { id: "1", title: "sanket@webknotinc.com" },
  { id: "2", title: "kousick@webknotinc.com" },
];

export default function page() {
  return (
    <section className={style.main_page_common_container}>
      <PageHeadingTab title="Users" />
      <Table
        users
        data={data}
        config={{
          heads: ["Users", "Associated space", "Actions"],
          align: [null, "center", "center"],
        }}
      />
    </section>
  );
}
