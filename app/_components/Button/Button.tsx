import React from "react";
import style from "./Button.module.scss";

type TButton = {
  variant: "filled" | "outlined";
  size: string;
  color: string;
  type?: "button" | "submit";
  children: any;
  onClick?: any;
};
export default function Button({
  variant,
  size,
  color,
  type,
  children,
  onClick,
}: TButton) {
  return (
    <button
      onClick={onClick}
      className={`${
        variant == "filled" ? `bg-${color} text-white` : "border text-text"
      } ${style.button_main} ${style[size]}`}
      type={type || "button"}
    >
      {children}
    </button>
  );
}
