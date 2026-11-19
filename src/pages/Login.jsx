import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import Button from "../components/Button";
import { useAuth } from "../contexts/fakeAuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const userLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  };
  return (
    <section className={styles.login}>
      <form className={styles.form} onSubmit={userLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button btnType="primary">Login</Button>
        </div>
      </form>
    </section>
  );
}
