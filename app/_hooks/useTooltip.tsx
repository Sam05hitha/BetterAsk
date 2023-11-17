import { useState } from "react";

export default function useTooltip(): [boolean, () => void, () => void] {
  const [show, setShow] = useState<boolean>(false);

  function handleShow() {
    setShow(true);
  }

  function handleHide() {
    setShow(false);
  }

  return [show, handleShow, handleHide];
}
