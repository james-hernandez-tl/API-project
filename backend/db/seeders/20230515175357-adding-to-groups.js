'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId:4,
        name:'Playing apex',
        about:"we play apex aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa ",
        type:'Online',
        private:false,
        city:'city1',
        state:'state1'

      },
      {
        organizerId:5,
        name:'Gym stuff',
        about:"we do stuff at the gym aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa ",
        type:'In person',
        private:true,
        city:'city2',
        state:'state2'
      },
      {
        organizerId:4,
        name:'playing league',
        about:"we hate playing league aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa ",
        type:'Online',
        private:false,
        city:'city1',
        state:'state1'
      },
      {
        organizerId:6,
        name:'hambuger lovers',
        about:"we love hamburgers aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa ",
        type:'In person',
        private:false,
        city:'city3',
        state:'state3'

      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
  }
};
