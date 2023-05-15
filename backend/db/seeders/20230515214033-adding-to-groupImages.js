'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    queryInterface.bulkInsert(options, [
      {
        groupId:1,
        url:'randomURl',
        preview:false
      },
      {
        groupId:1,
        url:'randomURl',
        preview:false
      },
      {
        groupId:1,
        url:'randomURl',
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
