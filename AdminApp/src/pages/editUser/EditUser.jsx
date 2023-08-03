import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./editUser.module.css";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = ({ inputs }) => {
  const { userId } = useParams();
  const [info, setInfo] = useState({ isAdmin: false });
  const token = Cookies.get("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setInfo({
        username: res.data.username,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
        password: res.data.password,
        fullName: res.data.fullName,
        isAdmin: res.data.isAdmin,
      });
    };
    fetchData();
  }, []);

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

      await axios.put(`/users/${userId}`, newUser, {
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
          <h1>Edit User</h1>
        </div>
        <div className={classes.bottom}>
          <div className={classes.right}>
            <form>
              {inputs.map((input) => (
                <div className={classes.formInput} key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    value={info[input.id] || ""}
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
                  checked={info.isAdmin || false}
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

export default EditUser;
