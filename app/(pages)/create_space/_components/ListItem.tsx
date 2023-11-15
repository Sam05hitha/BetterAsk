import React from "react";
import style from "./_styles/listAdded.module.scss";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

export default function ListItem() {
  return (
    <li className={style.list_item_container}>
      <p className="font-medium">Project Proposal.pdf</p>
      <div className={style.list_item_action}>
        <div className={style.item_check}>
          <CheckCircleOutlineOutlinedIcon />
        </div>
        <button>
          <RemoveCircleOutlineOutlinedIcon />
        </button>
      </div>
    </li>
  );
}
