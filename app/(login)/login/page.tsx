"use client";

import style from "./login.module.scss";
import { LoginForm } from "../../_components";
import { TLogin, TOnChange, TOnSubmit } from "@/app/_utils/types";
import appAuth from "../appAuth";

type TAuth = {
  inputs: TLogin;
  handleInputChange: TOnChange;
  handleOnSubmit: TOnSubmit;
};

function Login({ inputs, handleInputChange, handleOnSubmit }: TAuth) {
  return (
    <>
      <LoginForm
        input={inputs}
        onChange={handleInputChange}
        onSubmit={handleOnSubmit}
        login={true}
      />
    </>
  );
}

export default appAuth(Login);
