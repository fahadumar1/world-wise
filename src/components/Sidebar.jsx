import { Outlet } from "react-router";
import AppNav from "./AppNav";
import styles from "./Sidebar.module.css";
import Footer from "./Footer";
const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <AppNav />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default Sidebar;
