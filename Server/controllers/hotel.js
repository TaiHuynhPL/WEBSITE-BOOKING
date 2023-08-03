const Hotel = require("../models/hotel");
const Room = require("../models/room");

exports.createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const saveHotel = await newHotel.save();
    res.status(200).json(saveHotel);
  } catch (err) {
    next(err);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

exports.deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted!");
  } catch (err) {
    next(err);
  }
};

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("rooms");
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().populate("rooms");

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

//GET HOTELS TO RENDER SEARCH PAGE (condition : city, date , min price, max price)
exports.getSearchHotels = async (req, res, next) => {
  const { city, min, max, alldates } = req.body;
  try {
    let list = await Hotel.find({ city }).populate("rooms");

    if (alldates) {
      const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date) => {
          return alldates.includes(new Date(date).getTime());
        });

        return !isFound;
      };

      list = list.filter((hotel) =>
        hotel.rooms.some((room) => {
          return room.roomNumbers.some((roomNumber) => {
            return isAvailable(roomNumber);
          });
        })
      );
    }

    if (min) {
      list = list.filter((hotel) =>
        hotel.rooms.some((room) => room.price >= min)
      );
    }
    if (max) {
      list = list.filter((hotel) =>
        hotel.rooms.some((room) => room.price <= max)
      );
    }
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

exports.topRateHotel = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().populate("rooms");
    const topThreeRate = await hotels
      .sort((a, b) => b.rating - a.rating)
      .splice(0, 3);
    res.status(200).json(topThreeRate);
  } catch (err) {
    next(err);
  }
};

exports.getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
