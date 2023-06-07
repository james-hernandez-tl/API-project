'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId:1,
        url:'https://i.imgur.com/rF9bvAW.jpeg',
        preview:false
      },
      {
        eventId:2,
        url:'https://i.imgur.com/rF9bvAW.jpeg',
        preview:true
      },
      {
        eventId:3,
        url:'https://i.imgur.com/ERXYenJ.jpeg',
        preview:false
      },
      {
        eventId:4,
        url:'https://i.imgur.com/ERXYenJ.jpeg',
        preview:false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['randomurl', 'townHall2', 'townHall3','townHall4'] }
    }, {});
  }
};
