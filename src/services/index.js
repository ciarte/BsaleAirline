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


module.exports = {
  sortFunc,

}