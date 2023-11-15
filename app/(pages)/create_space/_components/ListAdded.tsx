import React from "react";
import style from "./_styles/listAdded.module.scss";
import { ListItem } from "..";

interface IListAdded {
  users?: undefined | true;
  documents?: undefined | true;
}

export default function ListAdded({ users, documents }: IListAdded) {
  const sectionClass = users ? style.list_user_container : style.list_container;
  
  return (
    <ul className={sectionClass}>
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
    </ul>
  );
}
