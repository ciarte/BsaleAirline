let {
  sortFunc,
  getSeatByID,
  getFlightByID,
  getSeatsByAirplane,
  getBoardingPassByFligth,
} = require("../services/index.js");

let getAllFlights = async (req, res) => {
  let result = await getSeatByID();
  res.json(result);
};

let getFlightsByID = async (req, res) => {
  let idPassenger = req.params.id;
  let reservedSeat = [];
  let unAssings = [];

  try {
    let resultFlight = await getFlightByID(idPassenger);
    let airplane = resultFlight[0].airplane_id;

    let result = await getSeatsByAirplane(airplane);
    let boardingPass = await getBoardingPassByFligth(idPassenger);

    let resultFlights = {
      flightId: resultFlight[0].flight_id,
      takeoffDateTime: resultFlight[0].takeoff_date_time,
      takeoffAirport: resultFlight[0].takeoff_airport,
      landingDateTime: resultFlight[0].landing_date_time,
      landingAirport: resultFlight[0].landing_airport,
      airplaneId: resultFlight[0].airplane_id,
      passengers: [],
    };

    let allPassengers = boardingPass.sort(
      (a, b) => a.purchase_id - b.purchase_id
    );

    allPassengers.forEach((s) => {
      if (s.seat_id !== null) {
        reservedSeat.push(s.seat_id);
        resultFlights.passengers.push(s);
      }
      unAssings.push(s);
    });

    let availableSeat = await result.filter(
      (pass) => !reservedSeat.includes(pass.seat_id)
    );

    // let minors = allPassengers.filter((p) => p.age < 18 && p.seat_id == null);
    // let adults = allPassengers.filter((p) => p.age >= 18 && p.seat_id == null);

    let groupedPassengers = {};
    allPassengers.forEach((p) => {
      if (!groupedPassengers[p.purchase_id]) {
        groupedPassengers[p.purchase_id] = { minors: [], adults: [] };
      }
      if (p.age < 18) {
        groupedPassengers[p.purchase_id].minors.push(p);
      } else {
        groupedPassengers[p.purchase_id].adults.push(p);
      }
    });

    for (let [_, group] of Object.entries(groupedPassengers)) {
      let minors = group.minors;
      let adults = group.adults;

      for (let i = 0; i < minors.length; i++) {
        let minor = minors[i];
        let seatType = minor.seat_type_id;

        let availableSeatsForMinor = availableSeat.filter(
          (seat) => seat.seat_type_id === seatType
        );
        if (availableSeatsForMinor.length === 0) continue;
        let seatForMinor = availableSeatsForMinor[0];
        minor.seat_id = seatForMinor.seat_id;
        availableSeat.splice(availableSeat.indexOf(seatForMinor), 1);

        let seatRow = seatForMinor.seat_row;
        let nextSeatColumn = String.fromCharCode(
          seatForMinor.seat_column.charCodeAt() + 1
        );
        let availableSeatForAdult = availableSeat.find(
          (seat) =>
            seat.seat_row === seatRow && seat.seat_column === nextSeatColumn
        );
        if (!availableSeatForAdult) continue;

        let adult = adults.find((a) => !a.seat_id);
        if (!adult) continue;
        adult.seat_id = availableSeatForAdult.seat_id;
        resultFlights.passengers.push(minor, adult);
        availableSeat.splice(availableSeat.indexOf(availableSeatForAdult), 1);

        minors.splice(i, 1);
        i--;
        adults.splice(adults.indexOf(adult), 1);
      }
    }

    resultFlights.passengers = resultFlights.passengers
      .map(
        (d) =>
          (d = {
            passengerId: d.passenger_id,
            dni: d.dni,
            name: d.name,
            age: d.age,
            country: d.country,
            boardingPassId: d.boarding_pass_id,
            purchaseId: d.purchase_id,
            seatTypeId: d.seat_type_id,
            seatId: d.seat_id,
          })
      )
      .sort(sortFunc);

    if (resultFlight.length >= 0) {
      res.status(200).json({
        code: 200,
        data: resultFlights,
      });
    } else
      res.status(404).json({
        code: 404,
        data: {},
      });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not connect to db",
    });
  }
};

module.exports = {
  getAllFlights,
  getFlightsByID,
};
