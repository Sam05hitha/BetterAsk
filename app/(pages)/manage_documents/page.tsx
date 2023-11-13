import { PageHeadingTab, Table } from "@/app/_components";
import React from "react";
import style from "../../main.module.scss";

const data = [
  { id: "1", title: "Employee Handbook.pdf" },
  { id: "2", title: "Equal Employment Opportunity (EEO) Statement.pdf" },
];

export default function page() {
  return (
    <section className={style.main_page_common_container}>
      <PageHeadingTab title="Documents" />
      <Table
        documents
        data={data}
        config={{
          heads: ["Documents", "Associated space", "Actions"],
          align: [null, "center", "center"],
        }}
      />
    </section>
  );
}
