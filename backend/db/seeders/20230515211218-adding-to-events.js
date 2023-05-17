'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    queryInterface.bulkInsert(options, [
      {
        groupId: 2,
        venueId: 1,
        name: "first gym session",
        description: "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
        type: "In person",
        capacity: 10,
        price: 18.50,
        startDate: "2021-10-19 20:00:00",
        endDate: "2021-10-19 22:00:00",
      },
      {
        groupId: 3,
        venueId: 1,
        name: "just playing some games",
        description: "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
        type: "Online",
        capacity: 20,
        price: 48.50,
        startDate: "2021-11-19 20:00:00",
        endDate: "2021-11-19 22:00:00",
      },
      {
        groupId: 4,
        venueId: 1,
        name: "eating tons of hamburgers",
        description: "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
        type: "In person",
        capacity: 15,
        price: 10.50,
        startDate: "2021-12-19 20:00:00",
        endDate: "2021-12-19 22:00:00",
      },
      {
        groupId: 2,
        venueId: 3,
        name: "second gym session",
        description: "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
        type: "In person",
        capacity: 10,
        price: 18.50,
        startDate: "2021-13-19 20:00:00",
        endDate: "2021-13-19 22:00:00",
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['first gym session', 'just playing some games', 'eating tons of hamburgers','second gym session'] }
    }, {});
  }
};
