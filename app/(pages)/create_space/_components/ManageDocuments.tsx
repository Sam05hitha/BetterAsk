"use client";

import { Button } from "@/app/_components";
import React, { useRef, useState } from "react";
import style from "./_styles/manageSection.module.scss";
import ListAdded from "./ListAdded";

type TDrag = React.DragEvent<HTMLDivElement>;

export default function ManageDocuments() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  function handleOnChildElement() {
    if (dragRef.current) {
      dragRef.current.dispatchEvent(new Event("dragenter", { bubbles: true }));
    }
  }

  const handleBrowse = () => fileRef?.current?.click();

  const handleDragEnter = () => setDragging(true);

  const handleDragLeave = (event: TDrag) => {
    if (
      event.relatedTarget === null ||
      !event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      setDragging(false);
    }
  };

  const handleDragOver = (event: TDrag) => event.preventDefault();

  function handleDrop(event: TDrag) {
    event.preventDefault();
    setDragging(false);
  }

  return (
    <div
      ref={dragRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`${style.create_space_upload_section} ${style.dotted} ${
        dragging ? style.dragging : ""
      }`}
    >
      <div
        onDragEnter={handleOnChildElement}
        className={style.uploadDocumentTop}
      >
        <h3 className=" font-medium">Drag and drop your documents here</h3>
        <p className="text-text-100">Max file size 200 mbs</p>
        <Button
          onClick={handleBrowse}
          custom="w-[100px] h-[40px] mt-[20px]"
          size="bsmall"
          color="white"
          variant="outlined"
        >
          <div className={style.file_button}>
            <input ref={fileRef} type="file" name="" id="" />
            Browse
          </div>
        </Button>
      </div>
      <ListAdded documents />
    </div>
  );
}
