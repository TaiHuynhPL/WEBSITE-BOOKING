import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import classes from "./newRoom.module.css";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const token = Cookies.get("access_token");

  const { data, loading, error } = useFetch("/hotels");

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.id === "price" || e.target.id === "maxPeople") {
      setInfo((prev) => ({ ...prev, [e.target.id]: Number(e.target.value) }));
    } else {
      setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    try {
      if (!hotelId) {
        await axios.post(
          "/rooms/new",
          { ...info, roomNumbers },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      } else {
        await axios.post(
          `/rooms/${hotelId}`,
          { ...info, roomNumbers },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      }
      navigate("/rooms");
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
          <h1>Add New Room</h1>
        </div>
        <div className={classes.bottom}>
          <div className={classes.right}>
            <form>
              {roomInputs.map((input) => (
                <div className={classes.formInput} key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className={classes.formInput}>
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className={classes.formInput}>
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  <option value={""}>
                    No hotels yet, just adding new rooms
                  </option>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
