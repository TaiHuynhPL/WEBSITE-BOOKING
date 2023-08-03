import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../home/Navbar/Title/Title";
import styles from "./Register.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
    fullName: undefined,
    phoneNumber: undefined,
    email: undefined,
    isAdmin: false,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", credentials);
      if (res.status === 200) {
        const { isAdmin, ...other } = credentials;
        dispatch({ type: "LOGIN_SUCCESS", payload: other });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.lContainer}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.login}>
        <h2>Sign Up</h2>
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
          <input
            type="text"
            placeholder="Full Name"
            id="fullName"
            onChange={handleChange}
            className={styles.lInput}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            id="phoneNumber"
            onChange={handleChange}
            className={styles.lInput}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            onChange={handleChange}
            className={styles.lInput}
          />
          <button
            disabled={loading}
            onClick={handleClick}
            className={styles.lButton}
          >
            Create Account
          </button>
          {error && <span>{error.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default Login;
