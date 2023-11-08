import React from "react";
import style from "../_styles/chatAction.module.scss";
import { Button } from "@/app/_components";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";

type TActionButtons = {
  handleGoBack: () => void;
  handleCreateSpace: () => void;
};

export default function ChatActionButtons({
  handleCreateSpace,
  handleGoBack,
}: TActionButtons) {
  return (
    <div className={style.chatAction_top_buttons}>
      <Button
        onClick={handleCreateSpace}
        custom="mr-[10px] w-[180px] bg-white font-geo text-[16px]"
        variant="outlined"
        size="bwide"
        color="white"
      >
        <AddOutlinedIcon className="mr-2" />
        <span>Create new</span>
      </Button>
      <Button
        onClick={handleGoBack}
        custom="bg-white w-[50px] h-[50px] font-geo"
        variant="outlined"
        size="bwide"
        color="white"
      >
        <KeyboardReturnRoundedIcon />
      </Button>
    </div>
  );
}
