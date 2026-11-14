import styles from "./Button.module.css";
const Button = ({ children, onClick, btnType }) => {
  return (
    <button className={`${styles.btn} ${styles[btnType]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
