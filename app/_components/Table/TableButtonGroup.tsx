import React from "react";
import { Button } from "..";
import style from "./table.module.scss";

interface ITableButtons {
  spaces?: undefined | true;
  users?: undefined | true;
  documents?: undefined | true;
  onRemove: () => void;
  onChat: () => void;
  onView: () => void;
}

type TButtonConfig = {
  text: string;
  color: string;
  onClick: () => void;
  visible: boolean | undefined;
  variant: "filled" | "outlined";
}[];

export default function TableButtonGroup({
  spaces,
  documents,
  onRemove,
  onChat,
  onView,
}: ITableButtons) {
  const buttonsConfig: TButtonConfig = [
    {
      text: "View",
      color: "white",
      onClick: onView,
      visible: spaces || documents,
      variant: "outlined",
    },
    {
      text: "chat",
      color: "primary-100",
      onClick: onChat,
      visible: spaces,
      variant: "filled",
    },
    {
      text: "remove",
      color: "action",
      onClick: onRemove,
      visible: true,
      variant: "filled",
    },
  ];
  return (
    <div className={style.table_row_inner_container}>
      {buttonsConfig.map(
        (item) =>
          item.visible && (
            <Button
              key={item.text}
              custom="h-[40px] w-[85px]"
              variant={item.variant}
              size="bsmall"
              color={item.color}
              onClick={item.onClick}
            >
              {item.text}
            </Button>
          )
      )}
    </div>
  );
}
