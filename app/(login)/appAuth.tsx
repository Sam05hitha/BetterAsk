import React, { useReducer } from "react";
import isEmail from "validator/lib/isEmail";
import style from "./login.module.scss";
import { usePathname } from "next/navigation";

type TUser = {
  username: string;
  password: string;
};

type TLogin = {
  user: TUser;
  isError: boolean;
  errorMessage: string;
};

type TLoginAction =
  | { type: "USERNAME" | string; payload: string }
  | { type: "PASSWORD" | string; payload: string }
  | { type: "CHECK" | string; payload?: any };

const initialState = {
  user: {
    username: "",
    password: "",
  },
  isError: false,
  errorMessage: "Email or password is incorrect",
};

function check(user: TUser): boolean {
  const isEmailValid = isEmail(user.username);
  const isPassValid = user.password ? true : false;
  console.log(isEmailValid && isPassValid);
  return isEmailValid && isPassValid;
}

const reducer = (state: TLogin, action: TLoginAction) => {
  const actions: Record<TLoginAction["type"], TLogin> = {
    USERNAME: {
      ...state,
      user: { ...state.user, username: action.payload },
      isError: false,
    },
    PASSWORD: {
      ...state,
      user: { ...state.user, password: action.payload },
      isError: false,
    },
    CHECK: { ...state, isError: !check(state.user) },
  };
  const newState = actions[action.type];
  return newState ? newState : state;
};

export default function appAuth(WrappedComponent: any) {
  return (props: any) => {
    const path = usePathname();
    const [inputs, dispatch] = useReducer(reducer, initialState);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      //input
      const inputValue = event.target.value;
      const inputName = event.target.name;
      dispatch({ type: inputName, payload: inputValue });
    }

    function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      dispatch({ type: "CHECK" });
      if (check(inputs.user)) {
        //send form data
      }
    }
    return (
      <main className={`${style.login_container} font-inria bg-white`}>
        <h1 className="text-3xl font-extrabold">
          {path === "/login" ? "Sign in" : "Sign Up"}
        </h1>
        <WrappedComponent
          {...props}
          inputs={inputs}
          handleInputChange={handleInputChange}
          handleOnSubmit={handleOnSubmit}
        />
      </main>
    );
  };
}
