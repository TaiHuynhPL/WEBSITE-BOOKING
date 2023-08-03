import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import classes from "./navbar.module.css";

const Navbar = () => {
  return (
    <div className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.search}>
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
        <div className={classes.items}>
          <div className={classes.item}>
            <LanguageOutlinedIcon className={classes.icon} />
            English
          </div>
          <div className={classes.item}>
            <DarkModeOutlinedIcon className={classes.icon} />
          </div>
          <div className={classes.item}>
            <FullscreenExitOutlinedIcon className={classes.icon} />
          </div>
          <div className={classes.item}>
            <NotificationsNoneOutlinedIcon className={classes.icon} />
          </div>
          <div className={classes.item}>
            <ChatBubbleOutlineOutlinedIcon className={classes.icon} />
          </div>
          <div className={classes.item}>
            <ListOutlinedIcon className={classes.icon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
