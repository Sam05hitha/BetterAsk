"use client";

import { Button } from "@/app/_components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React from "react";
import style from "./_styles/createSpaceFooter.module.scss";
import { useRouter } from "next/navigation";

export default function CreateSpaceFooter() {
  const router = useRouter();

  function handleCancelSpace() {
    router.back();
  }

  return (
    <div className={style.create_space_footer_container}>
      <div className={`text-text-100 ${style.create_space_note}`}>
        <InfoOutlinedIcon />
        <p>
          In order to create a space, it&rsquo;s mandatory to specify a unique
          space name and upload the necessary documents.
        </p>
      </div>

      <div className={style.create_space_footer_button_group}>
        <Button
          onClick={handleCancelSpace}
          custom="w-[80px] h-[40px]"
          size="bsmall"
          color="white"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          custom="w-[80px] h-[40px]"
          size="bsmall"
          color="secondary-200"
          variant="filled"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
