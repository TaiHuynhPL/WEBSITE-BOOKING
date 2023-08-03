const express = require("express");

const {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getHotels,
  countByCity,
  countByType,
  topRateHotel,
  getHotelRooms,
  getSearchHotels,
} = require("../controllers/hotel");
const { verifyAdmin } = require("../utils/verifyToken");

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

//GET
router.get("/find/:id", getHotel);

//GET ALL
router.get("/", getHotels);

//POST HOTELS TO RENDER SEARCH PAGE
router.post("/search", getSearchHotels);

router.get("/countByCity", countByCity);

router.get("/countByType", countByType);

router.get("/topRateHotel", topRateHotel);

router.get("/room/:id", getHotelRooms);

module.exports = router;
