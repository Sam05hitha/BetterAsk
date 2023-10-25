"use client";

import { LoginForm } from "../../_components";
import { TLogin, TOnChange, TOnSubmit } from "@/app/_utils/types";
import appAuth from "../appAuth";

type TAuth = {
  inputs: TLogin;
  handleInputChange: TOnChange;
  handleOnSubmit: TOnSubmit;
};

function Signup({ inputs, handleInputChange, handleOnSubmit }: TAuth) {
  return (
    <>
      <LoginForm
        login={false}
        input={inputs}
        onChange={handleInputChange}
        onSubmit={handleOnSubmit}
      />
    </>
  );
}

export default appAuth(Signup);
