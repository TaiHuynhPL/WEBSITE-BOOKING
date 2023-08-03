const express = require("express");

const router = express.Router();
const { verifyAdmin } = require("../utils/verifyToken");
const {
  createRoom,
  createNewRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoomAvailability,
} = require("../controllers/room");

//CREATE
router.post("/new", verifyAdmin, createNewRoom);
router.post("/:hotelid", verifyAdmin, createRoom);

//UPDATE
router.put("/:id", verifyAdmin, updateRoom);
router.put("/availability/:id", updateRoomAvailability);
//DELETE
router.delete("/:id", verifyAdmin, deleteRoom);

//GET
router.get("/:id", getRoom);

//GET ALL
router.get("/", getRooms);

module.exports = router;
