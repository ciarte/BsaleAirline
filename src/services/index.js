const _ = require('lodash');

const sortFunc = function compareAge(a, b) {
  if (a.age < b.age) {
    return -1;
  }
  if (a.age > b.age) {
    return 1;
  }
  return 0;
}

  const boardingPassByPurchase = (passenger) => {passenger.reduce(
      (acc, curr) => {
        acc[curr.purchaseId] = acc[curr.purchaseId] || [];
        acc[curr.purchaseId].push(curr);
        return acc;
      },
      {}
    )};

const boardingPassBySeat = (result)=>  {result.reduce((acc, curr) => {
      acc[curr.seat_column] = acc[curr.seat_column] || [];
      acc[curr.seat_column].push(curr);
      return acc;
    }, {});}


module.exports = {
  sortFunc,
  boardingPassByPurchase,
  boardingPassBySeat,
  
}