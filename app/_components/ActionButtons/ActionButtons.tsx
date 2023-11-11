"use client";

import React from "react";
import style from "./actionButton.module.scss";
import { Button } from "@/app/_components";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";

type TActionButtons = {
  custom?: string[];
  handleGoBack: () => void;
  handleCreateSpace: () => void;
};

export default function ActionButtons({
  custom,
  handleCreateSpace,
  handleGoBack,
}: TActionButtons) {
  return (
    <div className={style.chatAction_top_buttons}>
      <Button
        onClick={handleCreateSpace}
        custom={`${
          custom && custom[0]
        } mr-[10px] bg-white font-geo text-[16px]`}
        variant="outlined"
        size="bwide"
        color="white"
      >
        <AddOutlinedIcon className="mr-1" />
        <span>Create new</span>
      </Button>
      <Button
        onClick={handleGoBack}
        custom={`${custom && custom[1]} bg-white font-geo`}
        variant="outlined"
        size="bwide"
        color="white"
      >
        <KeyboardReturnRoundedIcon />
      </Button>
    </div>
  );
}
