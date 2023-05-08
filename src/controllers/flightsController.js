const express = require("express");
const router = express.Router();
const connection = require("../database/db.js");
const {
  sortFunc,
  // boardingPassByPurchase,
  // boardingPassBySeat,
} = require("../services/index.js");

const getAllFlights = async (req, res) => {
  let [result] = await connection.query("SELECT * FROM seat");
  res.json(result);
};

const getFlightsByID = async (req, res) => {
  const idPassenger = req.params.id;
  const reservedSeat = [];
  const assings = [];

  try {
    const [resultFlight] = await connection.query(
      "SELECT * FROM flight WHERE flight_id=?",
      [idPassenger]
    );
    const [result] = await connection.query(
      "SELECT * FROM seat WHERE airplane_id = ?",
      [resultFlight[0].airplane_id]
    );

    const [boarding_pass] = await connection.query(
      "SELECT * FROM boarding_pass JOIN passenger ON boarding_pass.passenger_id = passenger.passenger_id WHERE flight_id=?",
      [idPassenger]
    );

    var resultFlights = {
      flightId: resultFlight[0].flight_id,
      takeoffDateTime: resultFlight[0].takeoff_date_time,
      takeoffAirport: resultFlight[0].landing_airport,
      landingDateTime: resultFlight[0].landing_date_time,
      landingAirport: resultFlight[0].landing_airport,
      airplaneId: resultFlight[0].airplane_id,
      passengers: [],
    };

    await boarding_pass.forEach((d) => {
      resultFlights.passengers.sort(sortFunc).push({
        passengerId: d.passenger_id,
        dni: d.dni,
        name: d.name,
        age: d.age,
        country: d.country,
        boardingPassId: d.boarding_pass_id,
        purchaseId: d.purchase_id,
        seatTypeId: d.seat_type_id,
        seatId: d.seat_id,
      });
    });

    let allPassengers = resultFlights.passengers;

    allPassengers.forEach((s) => {
      if (s.seatId !== null) {
        reservedSeat.push(s.seatId);
      }
    });

    //asientos disponibles en el vuelo
    let availableSeat = await result.filter(
      (pass) => !reservedSeat.includes(pass.seat_id)
    );

    //se agrupan asientos por filas
    const boardingPassBySeat = availableSeat.reduce((acc, curr) => {
      acc[curr.seat_column] = acc[curr.seat_column] || [];
      acc[curr.seat_column].push(curr);
      return acc;
    }, {});

    //asignar asientos primero a menores de edad
    let seats = availableSeat;

    for (let i = 0; i < allPassengers.length; i++) {
      if (allPassengers[i].seatId !== null) {
        let pass = allPassengers[i]
        if (pass.age < 18) {
          let adult = allPassengers.findIndex(
            (a) => a.purchaseId === pass.purchaseId && a.age >= 18
          );
          if (allPassengers[adult].seatId === null) {
            let j = 0;
            while (j < seats.length) {
              const setSeat = seats.filter(s => s.seat_type_id === allPassengers[adult].seatTypeId);
              newSeat = seats[j];
              const seatMenor = seats.find(s => s.seat_column === newSeat.seat_column && s.seat_row.charCodeAt() === newSeat.seat_row.charCodeAt()+1);
              if (seatMenor) {
                resultFlights.passengers[i].seatId = seatMenor.seat_id;
                resultFlights.passengers.adult.passengerId = newSeat.seat_id;
                break;
              } j++;
            // const setSeat = seats.filter(s=> s.seat_type_id === adult.seatTypeId)
            // const newSeat = setSeat[j]
            // const seatMenor = seats.find(
            //   s=> s.seat_column === setSeat.seat_column && s.seat_row.charCodeAt() === setSeat.seat_row.charCodeAt())
            // if(!seatMenor){
            //   j++;
            // } else {
            //    pass.seatId = seatMenor.seat_id;
            //    adult.seatId = newSeat.seat_id;
            // }
          }
        }console.log(seats)
      }
    } return  resultFlights.passengers;
  }
    
    console.log(seats);

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
