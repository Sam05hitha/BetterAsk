import React from "react";
import style from "./table.module.scss";

interface ITable {
  data: any[];
}

export default function Table({ data }: ITable) {
  return (
    <>
      {data.length ? (
        <>
          <div className={`${style.table_container} font-geo bg-secondary`}>
            <table className={style.table_main}>
              <thead></thead>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className={`${style.no_space_container}  font-geo bg-secondary`}>
            <h3 className={`${style.table_no_space} text-text-100`}>
              No Space available
            </h3>
          </div>
        </>
      )}
    </>
  );
}
