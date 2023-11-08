import React from "react";
import style from "./Button.module.scss";

type TButton = {
  variant: "filled" | "outlined";
  size: "bmedium" | "blarge" | "bsmall" | "bwide" | "bfull";
  color: string;
  type?: "button" | "submit";
  children: any;
  onClick?: any;
  custom?: string;
};
export default function Button({
  variant,
  size,
  color,
  type,
  children,
  onClick,
  custom,
}: TButton) {
  const bgColor = `bg-${color}`;
  const bSize = `${style[size]}`;

  return (
    <button
      onClick={onClick}
      className={`${
        variant == "filled"
          ? `${bgColor} ${custom}`
          : `${style.button_outlined} ${custom}`
      } ${style.button_main} ${bSize} ${custom}`}
      type={type || "button"}
    >
      {children}
    </button>
  );
}
