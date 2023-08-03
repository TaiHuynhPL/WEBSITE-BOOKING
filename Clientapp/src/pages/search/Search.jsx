import Navbar from "../home/Navbar/Navbar";
import Footer from "../home/Footer/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "./searchItem/SearchItem";
import axios from "axios";

import styles from "./Search.module.css";

//Component trang Search
const Search = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [data, setDate] = useState([]);
  const [loading, setLoading] = useState(false);

  const startDate = new Date(dates[0].startDate).getTime();
  const endDate = new Date(dates[0].endDate).getTime();

  const getDatesInRange = (startDate, endDate) => {
    let dates = [];

    let date = startDate;

    while (date <= endDate) {
      dates.push(date);
      date += 86400000;
    }

    return dates;
  };

  const alldates = getDatesInRange(startDate, endDate);

  const fetchData = async (dataPost) => {
    setLoading(true);
    const { data } = await axios.post("/hotels/search", dataPost);
    setLoading(false);
    setDate(data);
  };

  useEffect(() => {
    const dataPost = {
      city: destination,
      min: min || 0,
      max: max || 999,
      alldates: alldates,
    };
    fetchData(dataPost);
  }, []);

  const handleClick = () => {
    const dataPost = {
      city: destination,
      min: min || 0,
      max: max || 999,
      alldates: alldates,
    };
    fetchData(dataPost);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.listContainer}>
        <div className={styles.listWrapper}>
          <div className={styles.listSearch}>
            <h1 className={styles.lsTitle}>Search</h1>
            <div className={styles.lsItem}>
              <label>Destination</label>
              <input
                placeholder={destination}
                value={destination}
                type="text"
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className={styles.lsItem}>
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className={styles.lsItem}>
              <label>Options</label>
              <div className={styles.lsOptions}>
                <div className={styles.lsOptionItem}>
                  <span className={styles.lsOptionText}>
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className={styles.lsOptionInput}
                  />
                </div>
                <div className={styles.lsOptionItem}>
                  <span className={styles.lsOptionText}>
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className={styles.lsOptionInput}
                  />
                </div>
                <div className={styles.lsOptionItem}>
                  <span className={styles.lsOptionText}>Adult</span>
                  <input
                    type="number"
                    min={1}
                    className={styles.lsOptionInput}
                    placeholder={options.adult}
                  />
                </div>
                <div className={styles.lsOptionItem}>
                  <span className={styles.lsOptionText}>Children</span>
                  <input
                    type="number"
                    min={0}
                    className={styles.lsOptionInput}
                    placeholder={options.children}
                  />
                </div>
                <div className={styles.lsOptionItem}>
                  <span className={styles.lsOptionText}>Room</span>
                  <input
                    type="number"
                    min={1}
                    className={styles.lsOptionInput}
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className={styles.listResult}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
