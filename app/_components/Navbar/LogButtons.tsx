import React from "react";
import { Button } from "..";

type TLogGroup = {
  handleSignIn: (path: string) => void;
};

export default function LogButtons({ handleSignIn }: TLogGroup) {
  return (
    <>
      <div>
        <Button
          custom="mr-3"
          size="bmedium"
          color="white"
          onClick={handleSignIn("login")}
          variant="outlined"
        >
          Sign in
        </Button>
        <Button
          size="bmedium"
          color="white"
          onClick={handleSignIn("Signup")}
          variant="outlined"
        >
          Sign Up
        </Button>
      </div>
    </>
  );
}
