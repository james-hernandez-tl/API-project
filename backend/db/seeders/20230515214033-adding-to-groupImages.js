'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId:1,
        url:'https://i.imgur.com/x0G1BKy.jpeg',
        preview:false
      },
      {
        groupId:1,
        url:'https://i.imgur.com/Zgvte50.jpeg',
        preview:false
      },
      {
        groupId:1,
        url:'https://i.imgur.com/aVAResf.jpeg',
        preview:true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['randomURl'] }
    }, {});
  }
};
