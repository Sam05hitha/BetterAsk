import React, { useState } from "react";
import style from "./navbar.module.scss";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

type TNavProfile = {
  username: string;
  role: string;
};
export default function NavProfile({ username, role }: TNavProfile) {
  const [open, setOpen] = useState(false);

  function handleOpenMenu() {
    setOpen((prevState) => !prevState);
  }

  function handleOnLogOut() {
    setOpen(false);
  }

  return (
    <div className="relative">
      <button className={style.nav_profile} onClick={handleOpenMenu}>
        <span>{username}</span>
        <span className=" text-text-100">{role}</span>
      </button>
      {open && (
        <div className={style.nav_profile_menu}>
          <div>
            <ArrowLeftIcon className={`${style.arrow_up} text-white`} />
          </div>
          <button className="text-[16px]" onClick={handleOnLogOut}>Log Out</button>
        </div>
      )}
    </div>
  );
}
