import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import useFetch from "../../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import styles from "./Reserve.module.css";
import { AuthContext } from "../../../context/AuthContext";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [payment, setPayment] = useState("");
  const [errReserve, setErrReserver] = useState({
    isErr: false,
    message: "",
  });

  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { city, dates, options, dispatch } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const transferIdRoomToPriceFromData = (rooms, data) => {
    let priceRooms = [];
    for (let i = 0; i < rooms.length; i++) {
      const price = data.reduce((result, d) => {
        if (d.roomNumbers.map((r) => r._id).includes(rooms[i])) {
          result = d.price;
        }
        return result;
      }, 0);
      priceRooms.push(price);
    }
    return priceRooms.reduce((total, price) => {
      return (total += price);
    }, 0);
  };

  const transferIdRoomToPriceFromItem = (rooms, item) => {
    let priceRooms = [];
    for (let i = 0; i < rooms.length; i++) {
      if (item.roomNumbers.map((r) => r._id).includes(rooms[i])) {
        priceRooms.push(item.price);
      }
    }
    return priceRooms.reduce((total, price) => {
      return (total += price);
    }, 0);
  };

  const [date, setDate] = useState([
    dates.length === 0
      ? {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        }
      : {
          startDate: new Date(dates[0]?.startDate),
          endDate: new Date(dates[0]?.endDate),
          key: "selection",
        },
  ]);
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };
  const alldates = getDatesInRange(dates[0]?.startDate, dates[0]?.endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const days = dayDifference(dates[0]?.endDate, dates[0]?.startDate);

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    if (payment && selectedRooms.length > 0) {
      try {
        await Promise.all(
          selectedRooms.map((roomId) => {
            const res = axios.put(`/rooms/availability/${roomId}`, {
              dates: alldates,
            });
            return res.data;
          })
        );
        const resTransactions = await axios.post(`/transactions/${user._id}`, {
          hotel: hotelId,
          room: selectedRooms,
          dateStart: dates[0].startDate,
          dateEnd: dates[0].endDate,
          price: transferIdRoomToPriceFromData(selectedRooms, data),
          payment: payment,
          status: "Booked",
        });
        setOpen(false);
        navigate("/transaction");
      } catch (err) {
        console.log(err);
      }
    } else {
      setErrReserver({ isErr: true, message: "Infomation is empty!" });
    }
  };

  const [info, setInfo] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    cardNumber: undefined,
  });

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    dispatch({ type: "NEW_SEARCH", payload: { city, dates: date, options } });
  }, [date]);

  return (
    <div className={styles.reserve}>
      <div className={styles.datesRInfo}>
        <div className={styles.dateContainer}>
          <h3>Dates</h3>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setDate([item.selection]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className={styles.date}
            minDate={new Date()}
          />
        </div>
        <div className={styles.login}>
          <h3>Reserve Info</h3>
          <div className={styles.lContain}>
            <label htmlFor="fullName">Your Full Name:</label>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              value={info.fullName}
              onChange={handleChange}
              className={styles.lInput}
            />
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={info.email}
              onChange={handleChange}
              className={styles.lInput}
            />
            <label htmlFor="phone">Your Phone Number:</label>
            <input
              type="tel"
              placeholder="Phone Number"
              id="phone"
              value={info.phoneNumber}
              onChange={handleChange}
              className={styles.lInput}
            />
            <label htmlFor="cardNumber">Your Identity Card Number:</label>
            <input
              type="text"
              placeholder="Card Number"
              id="cardNumber"
              value={info.cardNumber}
              onChange={handleChange}
              className={styles.lInput}
            />
          </div>
        </div>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className={styles.rClose}
          onClick={() => setOpen(false)}
        />
      </div>
      <div className={styles.rContainer}>
        <h3>Select Rooms</h3>
        <div className={styles.selectedRoomsContainer}>
          {data.map((item) => (
            <div className={styles.rItem} key={item._id}>
              <div className={styles.rItemInfo}>
                <div className={styles.rTitle}>{item.title}</div>
                <div className={styles.rDesc}>{item.desc}</div>
                <div className={styles.rMax}>
                  Max people: <b>{item.maxPeople}</b>
                </div>
                <div className={styles.rPrice}>
                  ${days * transferIdRoomToPriceFromItem(selectedRooms, item)}
                </div>
              </div>
              <div className={styles.rSelectRooms}>
                {item.roomNumbers.map((roomNumber) => (
                  <div className={styles.room} key={roomNumber._id}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h4>
          Total Bill: $
          {days * transferIdRoomToPriceFromData(selectedRooms, data)}
        </h4>
        <div className={styles.paymentContainer}>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
          </select>
          <button onClick={handleClick} className={styles.rButton}>
            Reserve Now!
          </button>
        </div>
        {errReserve.isErr && (
          <p style={{ color: "red", marginLeft: "64px", marginTop: "12px" }}>
            {errReserve.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Reserve;
