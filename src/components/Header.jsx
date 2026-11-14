import { useMatch } from "react-router";
import styles from "./Header.module.css";
const Header = ({ children }) => {
  const isAppRoute = useMatch("/app/*");
  if (isAppRoute) return null;
  return <header className={styles.site_header}>{children}</header>;
};

export default Header;
