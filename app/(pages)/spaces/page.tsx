import React from "react";
import style from "../../main.module.scss";
import { PageHeadingTab, Table } from "../../_components";

const data = [
  { id: "1", title: "Salary and Finance" },
  { id: "2", title: "Salary and Finance" },
];

export default function page() {
  return (
    <section className={style.main_page_common_container}>
      <PageHeadingTab spaces title="Spaces" />
      <Table
        spaces
        data={data}
        config={{ heads: ["Space", "actions"], align: [null, "center"] }}
      />
    </section>
  );
}
