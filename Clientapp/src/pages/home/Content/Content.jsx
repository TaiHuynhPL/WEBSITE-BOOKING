import ShowCity from "./ShowCity/ShowCity";
import TypeHotel from "./TypeHotel/TypeHotel";
import Hotel from "./Hotel/Hotel";
import styles from "./Content.module.css";

//Lấy data từ file json
import hotels from "../../../data/hotel_list.json";

//Component nội dung chính trong trang home
function Content() {
  return (
    <div className={styles.container}>
      <ShowCity />
      <TypeHotel />
      <Hotel data={hotels}></Hotel>
    </div>
  );
}

export default Content;
