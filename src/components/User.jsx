import { useAuth } from "../contexts/fakeAuthContext";
import styles from "./User.module.css";
import { useNavigate } from "react-router-dom";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={(e) => userLogout(e)}>Logout</button>
    </div>
  );
}

export default User;
