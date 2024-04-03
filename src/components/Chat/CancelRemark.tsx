import styles from "./chat.module.scss";

interface ICancelRemarkProps {
  handleOnRemarkSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputData?: { [key: string]: any };
}

function CancelRemark(props: ICancelRemarkProps) {
  const { handleOnRemarkSubmit } = props;
  return (
    <form
      id="renderCustom"
      className={styles.remark_textbox_container}
      onSubmit={handleOnRemarkSubmit}
    >
      <label htmlFor="remark">
        <span>Remark: </span>
        <textarea
          name="remark"
          id="remark"
          cols={30}
          rows={5}
          autoFocus
          placeholder="Please enter here..."
        ></textarea>
      </label>
    </form>
  );
}

export default CancelRemark;
