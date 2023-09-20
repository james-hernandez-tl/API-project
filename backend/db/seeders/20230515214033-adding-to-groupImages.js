"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "GroupImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 1,
          url: "https://i.imgur.com/x0G1BKy.jpeg",
          preview: false,
        },
        {
          groupId: 1,
          url: "https://i.imgur.com/Zgvte50.jpeg",
          preview: false,
        },
        {
          groupId: 1,
          url: "https://i.imgur.com/aVAResf.jpeg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://cdn.discordapp.com/attachments/934145502252003410/1154181946952396862/Screen_Shot_2023-09-20_at_6.26.20_PM.png",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://cdn.discordapp.com/attachments/934145502252003410/1154180208748937277/Screen_Shot_2023-09-20_at_6.15.43_PM.png",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://i.imgur.com/pXWL35P.png",
          preview: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["randomURl"] },
      },
      {}
    );
  },
};
