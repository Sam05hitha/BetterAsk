import React from "react";
import style from "./input.module.scss";

type TInputLogin = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type: string;
  placeholder: string;
  required?: any;
  error: boolean;
};

export default function Input({
  value,
  onChange,
  name,
  type,
  placeholder,
  required,
  error,
}: TInputLogin) {
  return (
    <input
      className={`${style.login_input} bg-page-100 font-normal ${
        error && `border border-action text-action`
      }`}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required ? true : false}
    />
  );
}
