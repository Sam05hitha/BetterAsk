import { useNavigate } from "react-router-dom";
import style from "./home.module.scss";
import useSendQuery from "../../hooks/useSendQuery";
import logo from "../../assets/logo.svg";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import { Tooltip } from "@mui/material";
import { generateRandomId, localStorageProvider } from "../../utils/methods";

export default function Home() {
  const navigate = useNavigate();
  const { queryMutate, queryStatus } = useSendQuery({ onSettled });

  function onSettled(_data: any) {
    const local = localStorageProvider.getStorage();
    if (local) {
      navigate(`/chat/${local.session_id}`);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorageProvider.save({
      session_id: generateRandomId(10),
    });

    const formData = new FormData(event.currentTarget);
    const input = formData.get("prompt") as string;
    if (input) {
      queryMutate({ query: input });
    }
  }

  return (
    <div className={style.home_container}>
      <div className={style.hc_logo}>
        <img src={logo} alt="TAXLAB" role="presentation" />
      </div>
      <form className={style.hc_form} onSubmit={onSubmit}>
        <div className={style.hc_input}>
          <input
            disabled={queryStatus === "pending"}
            placeholder="Ask me anything about VAT"
            type="text"
            name="prompt"
          />
          <Tooltip title="send">
            <button type="submit">
              {queryStatus === "pending" ? (
                <HourglassBottomRoundedIcon
                  className={style.hc_input_loading}
                />
              ) : (
                <SendRoundedIcon />
              )}
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
}
