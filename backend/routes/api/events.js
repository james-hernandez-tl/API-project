const express = require('express');
var validator = require('validator');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendance} = require('../../db/models');

const {requireAuth} = require('../../utils/auth');
const event = require('../../db/models/event');
const router = express.Router();


router.get('/', async (req,res)=>{

  let {page, size, name, type, startDate} = req.query

  let errorResult = {message: "Bad Request",errors: {}}

  if (page && page < 1) errorResult.errors.page = "Page must be greater than or equal to 1"
  if (size && size < 1) errorResult.errors.size = "size must be greater than or equal to 1"
  if (name || typeof name !== 'string') errorResult.errors.name = "Name must be a string"
  if (type && type !== 'Online'  && type !== 'In person') errorResult.errors.type = "Type must be 'Online' or 'In Person'"
  if (startDate && !Date.parse(startDate)) errorResult.errors.startDate = "Start date must be a valid datetime"

  const pag = {}

  if (!page || page > 10) page = 1
  if (!size || size > 20) size = 20

  pag.limit = size
  pag.offset = size * (page - 1)

  const where = {}

  if (name) where.name = name
  if (type) where.type = type
  if (startDate) where.startDate == startDate

    const allEvents = await Event.findAll({
        ...pag,
        where,
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

    let validPrice = price.toString().split('.')
    console.log(validPrice)
    if (Number.isNaN(price) || validPrice[1].length > 2)  {
      errorResult.errors.price = "Price is invalid"
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

router.get('/:eventId/attendees', async (req,res)=>{

  const event = await Event.findByPk(req.params.eventId)

  if (!event){
    res.status(404)
    return res.json({
      "message": "Event couldn't be found"
    })
  }

  const group = await Group.findByPk(event.groupId)

  const membership = await Membership.findOne({
    where:{
      groupId:group.id,
      userId:req.user.id,
      status:'co-host'
    }
  })

  const allAttend = await Attendance.findAll({
    where:{
      eventId:req.params.eventId
    }
  })

  let Attendees = []

  if (group.organizerId == req.user.id || membership){

    for (let person of allAttend){
        let user = await User.findOne({
          where:{
            id:person.userId
          },
          attributes:['id','firstName','lastName']
        })

        user = user.toJSON()

        user.Attendance = {
          status:person.status
        }

        Attendees.push(user)
      }
  }else{
    for (let person of allAttend){
      let user = await User.findOne({
        where:{
          id:person.userId
        },
        attributes:['id','firstName','lastName']
      })

      user = user.toJSON()

      if (person.status !== 'pending'){
        user.Attendance = {
          status:person.status
        }

        Attendees.push(user)
      }
    }
  }

  res.json(Attendees)

  })

  router.post('/:eventId/attendance', requireAuth, async (req,res)=>{

    const event = await Event.findByPk(req.params.eventId)

    if (!event){
      res.status(404)
      return res.json({
        "message": "Event couldn't be found"
      })
    }

    let membership = await Membership.findOne({
      where:{
        userId: req.user.id,
        groupId:event.groupId
      }
    })

    if (!membership){
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }

    let alreadyAttending = await Attendance.findOne({
      where:{
        userId:req.user.id,
        eventId:req.params.eventId
      }
    })

    if (alreadyAttending){
         if (alreadyAttending.status == 'pending'){
          res.status(400)
          return res.json({
            "message": "Attendance has already been requested"
          })
         }else{
          res.status(400)
          return res.json({
            "message": "User is already an attendee of the event"
          })
         }
    }else{
      let newAttend = await Attendance.create({
        userId:req.user.id,
        eventId:req.params.eventId,
        status:'pending'
      })

      res.json({
        "userId": req.user.id,
        "status": "pending"
      })
    }


  })

  router.put("/:eventId/attendance", requireAuth, async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId)

    if (!event){
      res.status(404)
      return res.json({
        "message": "Event couldn't be found"
      })
    }

    const group = await Group.findByPk(event.groupId)

    let membership = await Membership.findOne({
      where:{
        userId: req.user.id,
        groupId:event.groupId,
        status:'co-host'
      }
    })

    if (group.organizerId!== req.user.id && !membership){
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }

    const {userId, status} = req.body

    const editAttend = await Attendance.findOne({
      where:{
        userId:userId,
        eventId:event.id
      }
    })

    if (status == 'pending'){
      res.status(400)
      return res.json({
        "message": "Cannot change an attendance status to pending"
      })
    }

    if (!editAttend){
      res.status(404)
      return res.json({
        "message": "Attendance between the user and the event does not exist"
      })
    }

    editAttend.status = status

    editAttend.save()

    res.json(editAttend)


  })

  router.delete('/:eventId/attendance',requireAuth, async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId)

    if (!event){
      res.status(404)
      return res.json({
        "message": "Event couldn't be found"
      })
    }

    const group = await Group.findByPk(event.groupId)

    const {userId} = req.body

    const attend = await Attendance.findOne({
      where:{
        userId:userId,
        eventId:event.id
      }
    })

    if (!attend){
      res.status(404)
      res.json({
        "message": "Attendance does not exist for this User"
      })
    }

    if (group.organizerId !== req.user.id && userId !== req.user.id){
      res.status(403)
      return res.json({
        "message": "Only the User or organizer may delete an Attendance"
      })
    }

    await attend.destroy()
    res.json({
      "message": "Successfully deleted attendance from event"
    })
  })

router.post('/:eventId/images',requireAuth, async (req,res)=>{
   const event = await Event.findByPk(req.params.eventId)

   if (!event){
    res.status(404)
    return res.json({
      "message": "Event couldn't be found"
    })
   }

   const group = await Group.findByPk(event.groupId)


   const attend = await Attendance.findOne({
     where:{
       userId:req.user.id,
       eventId:event.id,
       status:'attending'
      }
    })

    let membership = await Membership.findOne({
      where:{
        userId: req.user.id,
        groupId:event.groupId,
        status:'co-host'
      }
    })

    if (group.organizerId!== req.user.id && !membership && !attend){
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }


    const {url,preview} = req.body

    // const newImage = await GroupImage.create{

    // }
})

module.exports = router;
