'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    queryInterface.bulkInsert(options, [
      {
        email: 'james@user.io',
        username: 'jamesH123',
        hashedPassword: bcrypt.hashSync('password'),
        firstName:'james',
        lastName:'hernandez'
      },
      {
        email: 'james2@user.io',
        username: 'the2ndjames',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'james3@user.io',
        username: 'the3rdjames',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['jamesH123', 'the2ndjames', 'the3rdjames'] }
    }, {});
  }
};
