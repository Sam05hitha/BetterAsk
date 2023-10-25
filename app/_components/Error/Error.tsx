import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import style from "./error.module.scss";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

type TErrorI = {
  message: string;
  show: boolean;
  position: string;
};

export default function Error({ message, show, position }: TErrorI) {
  return (
    show && (
      <div className={`${style.error_i_container} ${position}`}>
        <ErrorOutlineIcon
          className={`w-5 text-action ${style.error_i} hover:text-action-100 transition-colors`}
        />

        <div className="relative" style={{ border: "1px solid" }}>
          <div
            className={`${style.error_i_message_box} bg-action text-white font-geo`}
          >
            <ArrowLeftIcon className={`text-action ${style.error_i_arrow}`} />
            {message}
          </div>
        </div>
      </div>
    )
  );
}
