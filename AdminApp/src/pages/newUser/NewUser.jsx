import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./newUser.module.css";
import { useNavigate } from "react-router-dom";

const NewUser = ({ inputs }) => {
  const [info, setInfo] = useState({ isAdmin: false });
  const token = Cookies.get("access_token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleChangeCheckbox = (e) => {
    setInfo((prev) => ({ ...prev, isAdmin: e.target.checked }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        ...info,
      };

      await axios.post("/auth/register", newUser, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      navigate("/users");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.new}>
      <Sidebar />
      <div className={classes.newContainer}>
        <Navbar />
        <div className={classes.top}>
          <h1>Add New User</h1>
        </div>
        <div className={classes.bottom}>
          <div className={classes.right}>
            <form>
              {inputs.map((input) => (
                <div className={classes.formInput} key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <div className={classes.formInputCheckbox}>
                <label>User is Admin:</label>
                <input
                  onChange={handleChangeCheckbox}
                  type="checkbox"
                  id="isAdmin"
                />
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
