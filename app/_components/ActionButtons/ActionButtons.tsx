"use client";

import React from "react";
import style from "./actionButton.module.scss";
import { Button } from "@/app/_components";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import Tooltip from "../Tooltip/Tooltip";
import useTooltip from "@/app/_hooks/useTooltip";

type TActionButtons = {
  spaces?: undefined | true;
  custom?: string[];
  handleGoBack: () => void;
  handleCreateSpace: () => void;
};

export default function ActionButtons({
  custom,
  spaces,
  handleCreateSpace,
  handleGoBack,
}: TActionButtons) {
  const [showBackTooltip, onShow, onHide] = useTooltip();

  return (
    <div className={style.chatAction_top_buttons}>
      {spaces && (
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
      )}
      <Button
        onHover={onShow}
        onHoverOut={onHide}
        onClick={handleGoBack}
        custom={`${custom && custom[1]} relative bg-white font-geo`}
        variant="outlined"
        size="bwide"
        color="white"
      >
        <KeyboardReturnRoundedIcon />
        <Tooltip show={showBackTooltip} text="go back" />
      </Button>
    </div>
  );
}
