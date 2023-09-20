"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Venues";
    return queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 2,
          address: "5009 Broadway, New York, NY 10034",
          city: "New York",
          state: "New York",
          lat: 27.2523523,
          lng: -214.2312332,
        },
        {
          groupId: 1,
          address: "Centeral Park",
          city: "New York",
          state: "New York",
          lat: 27.2523523,
          lng: -214.2312332,
        },
        {
          groupId: 3,
          address: "216 W 6th St",
          city: "Los Angeles",
          state: "California",
          lat: 27.2523523,
          lng: -214.2312332,
        },
        {
          groupId: 4,
          address: "191 North Broadway ",
          city: "New York",
          state: "New York",
          lat: 27.2523523,
          lng: -214.2312332,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: ["townHall", "townHall2", "townHall3", "townHall4"],
        },
      },
      {}
    );
  },
};
