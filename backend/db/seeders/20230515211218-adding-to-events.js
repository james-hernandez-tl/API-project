"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Events";
    return queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 2,
          venueId: 1,
          name: "Groove Fusion: A Night of Beats, Cocktails, and Electric Vibes",
          description:
            'Step into the heart of the city\'s nightlife as we transform this bar into a pulsating oasis of sound and style. "Groove Fusion" invites you to embark on a sensational journey of music, mixology, and electrifying energy',
          type: "In person",
          capacity: 30,
          price: 18.5,
          startDate: new Date("2021-9-19"),
          endDate: new Date("2021-9-19"),
        },
        {
          groupId: 3,
          venueId: 2,
          name: "Central Park Half Marathon: Run for a Greener Tomorrow",
          description:
            'Lace up your running shoes and get ready for a thrilling journey through the heart of the city\'s most iconic green oasis. The "Central Park Half Marathon: Run for a Greener Tomorrow" is your chance to combine your love for running with a passion for preserving the environment.',
          type: "In person",
          capacity: 2000,
          price: 48.5,
          startDate: new Date("2021-10-19"),
          endDate: new Date("2021-10-19"),
        },
        {
          groupId: 4,
          venueId: 3,
          name: "Burgerpalooza: A Burger Extravaganza You Can't Resist!",
          description:
            'Get ready for a mouthwatering celebration like no other! "Burgerpalooza" is back, and it\'s bigger and better than ever before. Join us for a day of culinary delight as we bring together burger aficionados from all corners of the city.',
          type: "In person",
          capacity: 15,
          price: 10.5,
          startDate: new Date("2021-11-19"),
          endDate: new Date("2021-11-19"),
        },
        {
          groupId: 1,
          venueId: 4,
          name: "Harmony in Worship: A Sacred Evening of Music and Reflection",
          description:
            'Join us at "Harmony in Worship" for an enchanting evening of spiritual nourishment and musical delight. "Harmony in Worship" invites you to experience the profound beauty of faith and music intertwined within the sacred walls of our historic church.',
          type: "In person",
          capacity: 30,
          price: 10.5,
          startDate: new Date("2021-12-19"),
          endDate: new Date("2021-12-19"),
        },
        {
          groupId: 4,
          venueId: 3,
          name: "Burger Fest Extravaganza",
          description:
            "Join us for a mouthwatering celebration of all things burger at the Burger Bliss Society's Burger Fest Extravaganza! We believe that every bite of a burger should be a reason to celebrate, and this event is designed to satisfy your burger cravings like never before.",
          type: "In person",
          capacity: 15,
          price: 10.5,
          startDate: new Date("2022-11-19"),
          endDate: new Date("2022-11-19"),
        },
        {
          groupId: 3,
          venueId: 2,
          name: "Big Apple Marathon Challenge",
          description:
            "Lace up your running shoes and get ready to conquer the iconic streets of the Big Apple! Join the New York Road Runners for an unforgettable marathon experience that takes you through the heart of New York City in the Big Apple Marathon Challenge.",
          type: "In person",
          capacity: 10000,
          price: 68.5,
          startDate: new Date("2021-10-19"),
          endDate: new Date("2021-10-19"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Groove Fusion: A Night of Beats, Cocktails, and Electric Vibes",
            "Central Park Half Marathon: Run for a Greener Tomorrow",
            "Burgerpalooza: A Burger Extravaganza You Can't Resist!",
            "Harmony in Worship: A Sacred Evening of Music and Reflection",
          ],
        },
      },
      {}
    );
  },
};
