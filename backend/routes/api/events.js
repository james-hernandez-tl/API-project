const express = require('express');
var validator = require('validator');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendance} = require('../../db/models');

const {requireAuth} = require('../../utils/auth');
const event = require('../../db/models/event');
const router = express.Router();


router.get('/', async (req,res)=>{
    const allEvents = await Event.findAll({
        attributes:{
            exclude:['updatedAt','createdAt','description','capacity','price']
        },
        include:[{
            model:Group,
            attributes:['id','name','city','state']
        },{
            model:Venue,
            attributes:['id','city','state']
        },{
            model:EventImage,
            where:{
                preview:true
            },
            required:false
        }]
    })
    let newEvents = []

    for (let event of allEvents){
        event = event.toJSON()
        const numAttending = await Attendance.count({
            where:{
                eventId:event.id,
                status:'attending'
            }
        })
        event.numAttending = numAttending

        event.previewImage = event.EventImages[0]? event.EventImages[0].url: null

        delete event.EventImages
        newEvents.push(event)
    }

    res.json({Events:newEvents})
})


router.get('/:eventId', async (req,res)=>{
    let event = await Event.findOne({
        where:{
            id:req.params.eventId
        },
        attributes:{
            exclude:['updatedAt','createdAt']
        },
        include:[{
            model:Group,
            attributes:['id','name','city','state','private']
        },{
            model:Venue,
            attributes:['id','city','state','address','lat','lng']
        },{
            model:EventImage,
            attributes:['id','url','preview']
        }]
    })

    if (!event){
        res.status(404)
        return res.json({
            "message": "Event couldn't be found"
          })
    }


        event = event.toJSON()
        const numAttending = await Attendance.count({
            where:{
                eventId:event.id,
                status:'attending'
            }
        })
        event.numAttending = numAttending



    res.json(event)
})

router.put('/:eventId',requireAuth, async (req,res)=>{
    const event = await Event.findOne({
        where:{
            id:req.params.eventId
        },
        attributes:{
            exclude:['updatedAt','createdAt']
        }
    })

    if (!event){
        res.status(404)
        return res.json({
            "message": "Event couldn't be found"
          })
    }

    const group = await Group.findOne({
        where:{
          id:event.groupId
        }
      })

      if (!group){
        res.status(404)
        return res.json({
          "message": "Group couldn't be found"
        })
      }

      const membership = await Membership.findOne({
        where:{
          groupId:event.groupId,
          userId:req.user.id
        }
      })

      if (group.organizerId !== req.user.id && !membership ){
        res.status(401)
          return res.json({
              "message": "Forbidden"
            })
      }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
        res.status(401)
          return res.json({
              "message": "Forbidden"
            })
      }

      const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body

      let errorResult = {message: "Bad Request",errors: {}}

    if (venueId){
      const venue = await Venue.findByPk(venueId)
      if(!venue) errorResult.errors.venueId = "Venue does not exist"
    }

    if (!name || name.length < 5) errorResult.errors.name = "Name must be at least 5 characters"
    if (type && type !== 'Online' && type !=='In person') errorResult.errors.type = "Type must be Online or In person"
    if (!capacity || typeof capacity !== 'number') errorResult.errors.capacity = "Capacity must be an integer"
    if (!price || typeof price !== 'number') errorResult.errors.price = "Price is invalid"
    if (!description) errorResult.errors.description = "Description is required"
    if (startDate){
             const currentDate = new Date()
             const theirDate = new Date(startDate)
             if (currentDate > theirDate){
              errorResult.errors.startDate = "Start date must be in the future"
             }
    }

    if (endDate && startDate){
       if (endDate < startDate) errorResult.errors.endDate = "End date is less than start date"
    }

    if (Object.keys(errorResult.errors).length){
      res.status(400)
      return res.json(errorResult)
    }

    if (venueId) event.venueId = venueId
    if (name) event.name = name
    if (type) event.type = type
    if (capacity) event.capacity = capacity
    if (price) event.price = price
    if (description) event.description = description
    if (startDate) event.startDate = startDate
    if (endDate) event.endDate = endDate

    event.save()
    res.json(event)
})

router.delete('/:eventId',requireAuth, async (req,res)=>{
    const event = await Event.findOne({
        where:{
            id:req.params.eventId
        },
        attributes:{
            exclude:['updatedAt','createdAt']
        }
    })

    if (!event){
        res.status(404)
        return res.json({
            "message": "Event couldn't be found"
          })
    }

    const group = await Group.findOne({
        where:{
          id:event.groupId
        }
      })

      const membership = await Membership.findOne({
        where:{
          groupId:event.groupId,
          userId:req.user.id
        }
      })

      if (group.organizerId !== req.user.id && !membership ){
        res.status(401)
          return res.json({
              "message": "Forbidden"
            })
      }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
        res.status(401)
          return res.json({
              "message": "Forbidden"
            })
      }

      event.destroy()

      res.json({
        "message": "Successfully deleted"
      })
})

router.post('/:eventId/images',requireAuth, async (req,res)=>{

})

module.exports = router;
