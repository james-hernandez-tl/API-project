'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    queryInterface.bulkInsert(options, [
      {
        userId:5,
        groupId:1,
        status:'co-host'
      },
      {
        userId:4,
        groupId:2,
        status:'member'
      },
      {
        userId:6,
        groupId:1,
        status:'pending'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [4, 5, 6] }
    }, {});
  }
};
