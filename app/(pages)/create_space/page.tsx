import React from "react";
import style from "./create_space.module.scss";
import { Button } from "@/app/_components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CreateSpaceFooter, ManageDocuments, ManageUsers } from ".";
import { useRouter } from "next/navigation";

export default function page() {

  // TODO: add error boundary 
  

  return (
    <section className={`bg-white ${style.create_space_page_container}`}>
      <div className={`${style.create_space_container_two} bg-secondary `}>
        <div className={style.create_space_name_container}>
          <input type="text" placeholder="Enter space name" />
        </div>

        <div className={style.create_space_uploads_container}>
          <ManageDocuments />
          <ManageUsers />
        </div>

        <CreateSpaceFooter  />
      </div>
    </section>
  );
}
