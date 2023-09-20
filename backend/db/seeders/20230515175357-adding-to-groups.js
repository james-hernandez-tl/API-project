"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 4,
          name: "Harmony in Worship Community",
          about:
            'Are you someone who finds solace, inspiration, and spiritual nourishment through music and reflection? Welcome to the "Harmony in Worship Community"! We are a group inspired by the magical evening of "Harmony in Worship", and we are committed to fostering a continuing sense of unity and serenity through the power of faith and music.',
          type: "In person",
          private: false,
          city: "New York",
          state: "New York",
        },
        {
          organizerId: 5,
          name: "Groove Fusion Enthusiasts",
          about:
            'Are you a lover of electrifying beats, innovative cocktails, and unforgettable nights on the town? Welcome to the "Groove Fusion Enthusiasts" group, where we celebrate the spirit of "Groove Fusion" and the vibrant nightlife it represents!',
          type: "In person",
          private: true,
          city: "New York",
          state: "New York",
        },
        {
          organizerId: 4,
          name: "New York Road Runners",
          about:
            'Calling all runners, nature lovers, and environmental enthusiasts! Welcome to the "Central Park Marathon Enthusiasts" group, a community of like-minded individuals who share a passion for running, preserving the environment, and embracing the beauty of Central Park.',
          type: "In person",
          private: false,
          city: "New York",
          state: "New York",
        },
        {
          organizerId: 6,
          name: "Burger Bliss Society: Where Every Bite is a Celebration",
          about:
            'Welcome to the "Burger Bliss Society," a community dedicated to the art of savoring the most beloved and iconic culinary delight – hamburgers! If you have a passion for perfectly grilled patties, creative toppings, and the pursuit of burger perfection, you\'ve found your gastronomic haven.',
          type: "In person",
          private: false,
          city: "Los Angeles",
          state: "California",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
  },
};
