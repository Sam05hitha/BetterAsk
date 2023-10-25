import Link from "next/link";
import React, { ChangeEvent, FormEvent } from "react";
import { Button, Error, Input } from "..";
import style from "../../(login)/login.module.scss";

type TUser = {
  username: string;
  password: string;
};

type TLogin = {
  user: TUser;
  isError: boolean;
  errorMessage: string;
};

type TLoginForm = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  input: TLogin;
  login?: boolean;
};

export default function LoginForm({
  onSubmit,
  onChange,
  input,
  login,
}: TLoginForm) {
  return (
    <form className={style.login_form} onSubmit={onSubmit}>
      <Input
        error={input.isError}
        type="text"
        name="USERNAME"
        placeholder="Enter your email"
        value={input.user.username}
        onChange={onChange}
        required
      />
      <Input
        error={input.isError}
        type="password"
        name="PASSWORD"
        placeholder="Enter your password"
        value={input.user.password}
        onChange={onChange}
        required
      />
      <div className="relative w-full">
        <Error
          position="bottom-10 -right-10"
          message={input.errorMessage}
          show={input.isError}
        />
      </div>
      <Button variant="filled" size="button_full" color="primary" type="submit">
        {login ? "Log In" : "Sign Up"}
      </Button>
      <div className="flex items-start w-full mt-6">
        <p className="text-text-100">
          {login ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link
          className="ml-3 underline text-primary-100"
          href={!login ? "/login" : "/Signup"}
        >
          {!login ? "Log In" : "Sign Up"}
        </Link>
      </div>
    </form>
  );
}
