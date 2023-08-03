import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../home/Navbar/Title/Title";
import styles from "./Login.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className={styles.lContainer}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.login}>
        <h2>Login</h2>
        <div className={styles.lContain}>
          <input
            type="text"
            placeholder="username"
            id="username"
            onChange={handleChange}
            className={styles.lInput}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={handleChange}
            className={styles.lInput}
          />
          <button
            disabled={loading}
            onClick={handleClick}
            className={styles.lButton}
          >
            Login
          </button>
          {error && <span>{error.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default Login;
