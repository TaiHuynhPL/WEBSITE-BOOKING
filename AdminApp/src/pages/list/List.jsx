import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import classes from "./list.module.css";

const List = ({ columns }) => {
  return (
    <div className={classes.list}>
      <Sidebar />
      <div className={classes.listContainer}>
        <Navbar />
        <Datatable columns={columns} />
      </div>
    </div>
  );
};

export default List;
