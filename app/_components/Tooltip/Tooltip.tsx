"use client";

import React, { useState } from "react";
import style from "./tooltip.module.scss";

interface ITooltip {
  text: string;
  show: boolean;
}

export default function Tooltip({ text, show }: ITooltip) {
  return (
    <div
      className={`${style.tooltip_container} ${
        show ? style.tooltip_visible : ""
      }`}
    >
      <div className="relative">
        <div className={` bg-text ${style.tooltip_floating}`}>{text}</div>
      </div>
    </div>
  );
}
