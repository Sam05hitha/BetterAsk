import { ChangeEvent, FormEvent } from "react";

export type TUser = {
  username: string;
  password: string;
};

export type TLogin = {
  user: TUser;
  isError: boolean;
  errorMessage: string;
};

export type TLoginAction =
  | { type: "USERNAME" | string; payload: string }
  | { type: "PASSWORD" | string; payload: string }
  | { type: "CHECK" | string; payload?: any };

export type TOnChange = (event: ChangeEvent<HTMLInputElement>) => void;

export type TOnSubmit = (event: FormEvent<HTMLFormElement>) => void;

export type TConversation = {
  isPending?: boolean;
  query: string;
  answer: string;
  converstaion_id: string | number;
  timestamp: string;
  user_id: number;
};
