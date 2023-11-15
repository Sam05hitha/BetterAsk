"use client";

import React from "react";
import style from "./_styles/manageSection.module.scss";
import { Button } from "@/app/_components";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ListAdded from "./ListAdded";

export default function ManageUsers() {
  function handleAddUser() {
    // TODO: Add user onclick
  }
  return (
    <div className={style.create_space_upload_section}>
      <div className={style.add_users_top}>
        <input type="text" placeholder="Enter user email" />
        <Button
          onClick={handleAddUser}
          custom="h-[40px] w-[100px]"
          variant="outlined"
          size="bsmall"
          color="white"
        >
          <AddOutlinedIcon />
        </Button>
      </div>
      <ListAdded users />
    </div>
  );
}
