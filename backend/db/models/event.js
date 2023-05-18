'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Event.belongsToMany( models.User,{
        through: models.Attendance,
        foreignKey:'eventId',
        otherKey:'userId'
      } )

      Event.belongsTo(models.Venue, {
        foreignKey:'venueId'
      })

      Event.hasMany(models.EventImage, {
        foreignKey:'eventId'
      })

      Event.belongsTo(models.Group, {
        foreignKey:'groupId',
        onDelete:'CASCADE'
      })
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: {
      type:DataTypes.INTEGER,
      onDelete:'CASCADE'
    },
    name: {
      type:DataTypes.STRING,
      validate:{
        len:[5,100]
      }
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:false
    },
    type: DataTypes.ENUM('Online','In person'),
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: {
      type:DataTypes.DATEONLY,
      validate:{
        future(value){
             const currentDate = new Date()
             const theirDate = new Date(value)
             if (currentDate > theirDate){
              throw new Error("Start date must be in the future")
             }
        }
      }
    },
    endDate: {
      type:DataTypes.DATEONLY,
      validate:{
         farther(value){
            if (this.startDate > value){
              throw new Error("End date is less than start date")
            }
         }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
