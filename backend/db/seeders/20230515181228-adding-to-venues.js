'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId:2,
        address:"townHall",
        city:'city1',
        state:'state1',
        lat: 27.2523523,
        lng: -214.2312332
      },
      {
        groupId:1,
        address:"townHall2",
        city:'city2',
        state:'state2',
        lat: 27.2523523,
        lng: -214.2312332
      },
      {
        groupId:3,
        address:"townHall3",
        city:'city3',
        state:'state3',
        lat: 27.2523523,
        lng: -214.2312332
      },
      {
        groupId:4,
        address:"townHall4",
        city:'city4',
        state:'state4',
        lat: 27.2523523,
        lng: -214.2312332
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['townHall', 'townHall2', 'townHall3','townHall4'] }
    }, {});
  }
};
