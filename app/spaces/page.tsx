import React from "react";
import style from "./spaces.module.scss";
import { PageHeadingTab, Table } from "../_components";

export default function page() {
  return (
    <section className={style.spaces_page_container}>
      <PageHeadingTab title="Spaces" />
      <Table data={[1]} />
    </section>
  );
}
