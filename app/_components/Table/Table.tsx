"use client";

import React from "react";
import style from "./table.module.scss";
import { TableButtonGroup } from "..";

interface ITable {
  spaces?: undefined | true;
  users?: undefined | true;
  documents?: undefined | true;
  data: any[];
  config: { heads: string[]; align: (null | "center")[] };
}

export default function Table({
  data,
  config,
  spaces,
  users,
  documents,
}: ITable) {
  const align = config.align;

  return (
    <>
      {data.length ? (
        <>
          <div className={`${style.table_container} font-geo bg-secondary`}>
            <table className={style.table_main}>
              <thead className="bg-secondary-200">
                <tr>
                  {config.heads.map((item, index) => (
                    <th
                      key={index}
                      className={align[index] ? style.table_center : ""}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr>
                    <td className={style.table_overflow_ellipses}>
                      {item.title}
                    </td>
                    {(documents || users) && (
                      <td
                        className={`${style.table_center} ${style.table_overflow_ellipses}`}
                      >
                        Human Resources
                      </td>
                    )}
                    <td>
                      <TableButtonGroup
                        onChat={() => {}}
                        onRemove={() => {}}
                        onView={() => {}}
                        spaces={spaces}
                        users={users}
                        documents={documents}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
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
