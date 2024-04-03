import { useEffect, useMemo, useState } from "react";
import { Modal } from "@mui/material";
import style from "./alterbar.module.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { createPortal } from "react-dom";

type TSeverity = "info" | "success" | "warning" | "error" | "loading";

export interface IConfigProps {
  severity: TSeverity;
  title: string;
  delay?: number;
  hideButton?: undefined | boolean;
  titleTwo?: string;
  isPrompt?: undefined | boolean;
  disableAutoClose?: undefined | boolean;
}

interface IAlertBarProps {
  open: boolean;
  onClose: () => void;
  config: IConfigProps | null;
  onClick?: () => void;
  renderCustom?: undefined | React.ReactNode;
  onPromptContinue?: () => void;
}

export default function AlertBar(props: IAlertBarProps) {
  const { open, onClose, config, onClick, onPromptContinue, renderCustom } =
    props;
  const [inOpen, setInIOpen] = useState<boolean>(open);

  useEffect(() => {
    if (config?.disableAutoClose) {
      return;
    }
    let timer: any = null;
    if (timer) {
      clearTimeout(timer);
    }

    if (open) {
      timer = setTimeout(() => {
        setInIOpen(false);
        onClose();
        onClick?.();
      }, config?.delay ?? 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [open, config, onClose]);

  useEffect(() => {
    setInIOpen(open);
  }, [open]);

  function handleContinue() {
    setInIOpen(false);
    onClose();
    onClick?.();
  }

  const memoizedRenderCustom = useMemo(() => renderCustom, [renderCustom]);

  function AlertBarJSX() {
    return (
      <Modal open={inOpen} onClose={onClose} aria-labelledby="edit profile">
        <div className={style.ab_container}>
          <div className={style.ab_content}>
            {config?.severity == "info" && <InfoOutlinedIcon />}
            {config?.severity == "success" && <CheckCircleRoundedIcon />}
            {config?.severity == "loading" && (
              <CachedOutlinedIcon className={style.ab_loading} />
            )}
            <h3>{config?.title}</h3>
            {config?.titleTwo && <p>{config?.titleTwo}</p>}
          </div>
          {!!memoizedRenderCustom && config?.isPrompt && memoizedRenderCustom}
          {config?.isPrompt ? (
            <div className={style.ab_prompt_buttons}>
              <button onClick={onClose}>Close</button>
              <button
                form="renderCustom"
                type="submit"
                disabled={config?.severity === "loading"}
                onClick={onPromptContinue}
              >
                Continue
              </button>
            </div>
          ) : (
            !config?.hideButton && (
              <button
                disabled={config?.severity === "loading"}
                onClick={handleContinue}
              >
                Continue
              </button>
            )
          )}
        </div>
      </Modal>
    );
  }

  return createPortal(<AlertBarJSX />, document.body);
}

export function useAlert() {
  const [open, setOpen] = useState<boolean>(false);
  const onOpen = () => setOpen(true);
  const [config, setConfig] = useState<IConfigProps | null>(null);
  const onClose = () => setOpen(false);
  const onConfig = (typeOfAlert: IConfigProps) =>
    setConfig({
      ...typeOfAlert,
    });
  return { open, onClose, onOpen, onConfig, config };
}
