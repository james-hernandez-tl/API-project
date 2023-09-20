"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "EventImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          url: "https://cdn.discordapp.com/attachments/934145502252003410/1154181946369384468/Screen_Shot_2023-09-20_at_6.26.38_PM.png",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://cdn.discordapp.com/attachments/934145502252003410/1154180208748937277/Screen_Shot_2023-09-20_at_6.15.43_PM.png",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://cdn.discordapp.com/attachments/934145502252003410/1154181946952396862/Screen_Shot_2023-09-20_at_6.26.20_PM.png",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://cdn.discordapp.com/attachments/934145502252003410/1154180209319358474/Screen_Shot_2023-09-20_at_6.15.09_PM.png",
          preview: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: ["randomurl", "townHall2", "townHall3", "townHall4"] },
      },
      {}
    );
  },
};
