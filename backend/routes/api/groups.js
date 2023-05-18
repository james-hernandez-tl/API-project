const express = require('express');
const bcrypt = require('bcryptjs');
var validator = require('validator');


const { Sequelize, User, Group, Membership, GroupImage, Venue,Event, EventImage, Attendance } = require('../../db/models');

const {requireAuth} = require('../../utils/auth')
const router = express.Router();

const Op = Sequelize.Op;

router.get('/', async (req,res)=>{

   const groups = await Group.findAll({
     include:{
        model:GroupImage,
        where:{
          preview:true,
        },
        attributes:['url'],
        required:false,
     }
   })
   let newGroups = []

   for (let group of groups){
      group = group.toJSON()
      let groupId = group.id
      let numMembers = await Membership.count({
        where:{
          groupId,
          status:{
            [Op.in]:['co-host','member']
          }
        }
      })

      group.numMembers = numMembers

      let {url} = group.GroupImages[0]? group.GroupImages[0]: {url:null}

      group.previewImage = url
      delete group.GroupImages
      newGroups.push(group)
   }

   res.json({'Groups': newGroups})
})

router.get('/current', async (req,res)=>{

    const { user } = req

    if (user){
        let groups = await Group.findAll({
            where:{organizerId:req.user.id},
            include:{model:GroupImage}
           })
        //  groups= groups.toJSON()
        const mems = await Membership.findAll({
            where:{
                userId:req.user.id,
                status:{
                  [Op.in]:['co-host','member']
                }
            }
           })

           const allGroups = []

           for (let people of mems){
              let group = await Group.findOne({
                where:{id:people.groupId},
                include:{model:GroupImage}
              })
            //    group = group.toJSON()
              allGroups.push(group)
           }

        //    allGroups = allGroups.toJSON()
        let news = []
           for (let group of groups.concat(allGroups)){
            group = group.toJSON()
            let numMembers = await Membership.count({
              where:{
                groupId:group.id,
                status:{
                  [Op.in]:['co-host','member']
                }
              }
            })

            group.numMembers = numMembers
            if( group.GroupImages.length == 0){
                console.log('adsfa')
                delete group.GroupImages
            }else{
                for (image of group.GroupImages){
                     if (image.preview == true){
                         group.previewImage = image.url
                        delete group.GroupImages
                     }
                }
            }
            news.push(group)
           }


           res.json({'Groups': news})

    }else{
        res.status(401)
        res.json({
            "message": "Authentication required"
          })
    }
})


 router.get('/:groupId', async (req,res)=>{
    const { groupId } = req.params

    let group = await Group.findOne({
        where:{id : groupId},
        include:[{
            model: GroupImage ,
            attributes:['id','url','preview']
        },{
            model:User,
            attributes:['id','firstName','lastName'],
            as:'Organizer'
        },{
            model:Venue,
            attributes:{
              exclude:['updatedAt','createdAt']
            }
        }]
    })

    if (!group){
      res.status(404)
     return res.json({
        "message": "Group couldn't be found",
      })
    }
    const numMembers = await Membership.count({
        where:{groupId},
        status:{
          [Op.in]:['co-host','member']
        }
    })
    group = group.toJSON()
    group.numMembers = numMembers
    res.json(group)

 })

 router.post('/', async(req,res)=>{
    const {user} = req

    if (user){
        const {name , about , type, private, city, state } = req.body
        let errorResult = {message:"Bad Request", errors:{}}

        if (name.length > 60) errorResult.errors.name = "Name must be 60 characters or less"
        if (about.length < 50 ) errorResult.errors.about =  "About must be 50 characters or more"
        if (type !== 'Online' && type !== 'In person') errorResult.errors.type = "Type must be 'Online' or 'In person'"
        if (private !== true && private !== false) errorResult.errors.private = "Private must be a boolean"
        if (!city) errorResult.errors.city = "City is required"
        if (!state) errorResult.errors.state = "State is required"

        if (Object.keys(errorResult.errors).length) {
          res.status(400)
          return res.json(errorResult)
        }

        let newGroup = {
            organizerId: req.user.id,
            name,
            about,
            type,
            private,
            city,
            state
        }



        const testing = await Group.build(newGroup)
        // console.log(newGroup)
        try {
            const valid = await testing.validate()
            // newGroup.save()
            newGroup = await Group.create(newGroup)
            res.status(201)
            return res.json(newGroup)
        }catch{
            res.status(400),
            res.json({
                "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
                "errors": {
                  "name": "Name must be 60 characters or less",
                  "about": "About must be 50 characters or more",
                  "type": "Type must be 'Online' or 'In person'",
                  "private": "Private must be a boolean",
                  "city": "City is required",
                  "state": "State is required"
                }
              })
        }



    }else{
        res.status(401)
       return  res.json({
            "message": "Authentication required"
          })
    }
  })


  router.post('/:groupId/images', async (req,res)=>{
      const { user } = req

      if (user){
        const group = await Group.findByPk(req.params.groupId)
        if (!group ){
            res.status(404)
            return res.json({
                "message": "Group couldn't be found"
              })
        }else if (user.id != group.organizerId){
            res.status(403)
            return res.json({
                "message": "Forbidden"
              })
        }
        const {url, preview} = req.body
        try {
            let newGroupImage = await GroupImage.create({
               url,
               preview
            })

            newGroupImage = await GroupImage.findOne({
                where:{
                    id:newGroupImage.id
                },
                attributes:['id','url','preview']
            })
            return res.json(newGroupImage)
        }catch{

        }


      }else{
        res.status(401)
        res.json({
            "message": "Authentication required"
          })
    }
  })

  router.put('/:groupId', async (req,res)=>{
    const {user} = req


    if (user){
        let group = await Group.findByPk(req.params.groupId)
        if (!group ){
            res.status(404)
            return res.json({
                "message": "Group couldn't be found"
              })
        }else if (user.id != group.organizerId){
            res.status(403)
            return res.json({
                "message": "Forbidden"
              })
        }

        const {name ,about, type, private, city, state } = req.body


        let errorResult = {message:"Bad Request", errors:{}}

        if (name.length > 60) errorResult.errors.name = "Name must be 60 characters or less"
        if (about.length < 50 ) errorResult.errors.about =  "About must be 50 characters or more"
        if (type !== 'Online' && type !== 'In person') errorResult.errors.type = "Type must be 'Online' or 'In person'"
        if (private !== true && private !== false) errorResult.errors.private = "Private must be a boolean"
        if (!city) errorResult.errors.city = "City is required"
        if (!state) errorResult.errors.state = "State is required"

        if (Object.keys(errorResult.errors).length) {
          res.status(400)
          res.json(errorResult)
        }


        if (name) group.name = name
        if (about)  group.about = about
        if (type)  group.type = type
        if (private)  group.private= private
        if (city)  group.city = city
        if (state) group.state = state


        try {
            group = await group.save()
            return res.json(group)
        }catch{
            res.status(400)
            return res.json({
                "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
                "errors": {
                  "name": "Name must be 60 characters or less",
                  "about": "About must be 50 characters or more",
                  "type": "Type must be 'Online' or 'In person'",
                  "private": "Private must be a boolean",
                  "city": "City is required",
                  "state": "State is required",
                }
              })
        }

    }else{
        res.status(401)
        return res.json({
            "message": "Authentication required"
          })
    }
  })

  router.delete('/:groupId', async (req,res)=>{

    const {user} = req

    if (user){
        let group = await Group.findByPk(req.params.groupId)
        if (!group ){
            res.status(404)
            return res.json({
                "message": "Group couldn't be found"
              })
        }else if (user.id != group.organizerId){
            res.status(403)
            return res.json({
                "message": "Forbidden"
              })
        }

        await group.destroy()

        return res.json({
            "message": "Successfully deleted"
          })

    }else{
        res.status(401)
        return res.json({
            "message": "Authentication required"
          })
    }

  })


  router.get('/:groupId/venues', requireAuth , async (req,res)=>{
    const group = await Group.findOne({
      where:{
        id:req.params.groupId
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
        groupId:req.params.groupId,
        userId:req.user.id
      }
    })

    if (group.organizerId !== req.user.id && !membership ){
      res.status(403)
        return res.json({
            "message": "Forbidden"
          })
    }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
      res.status(403)
        return res.json({
            "message": "Forbidden"
          })
    }

    const venue = await Venue.findAll({
      where:{
        groupId:req.params.groupId
      },
      attributes:{
        exlude:['updatedAt','createdAt']
      }
    })

    res.json({Venues:venue})

  } )

  router.post('/:groupId/venues', requireAuth, async (req,res)=>{
    const group = await Group.findOne({
      where:{
        id:req.params.groupId
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
        groupId:req.params.groupId,
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

    const {address, city, state, lat, lng} = req.body

    let errorResult = {message: "Bad Request",errors: {}}

    if (!address) errorResult.errors.address = "Street address is required"
    if (!city)  errorResult.errors.city = "City is required"
    if (!state) errorResult.errors.state = "State is required"
    if (!validator.isLatLong(lat.toString()+','+lng.toString())){
      errorResult.errors.lat = "Latitude is not valid"
      errorResult.errors.lan = "Longitude is not valid"
    }

    if (Object.keys(errorResult.errors).length){
      res.status(400)
      return res.json(errorResult)
    }

    let newVenue = await Venue.create({
      groupId:Number(req.params.groupId),
      address,
      city,
      state,
      lat,
      lng
    })

    newVenue = newVenue.toJSON()
    delete newVenue.createdAt
    delete newVenue.updatedAt

    return res.json(newVenue)

  })

  router.get('/:groupId/events', async (req,res)=>{
    const group = await Group.findAll({
      where:{
        id:req.params.groupId
      }
    })

    if (!group.length){
      res.status(404)
      return res.json({
        "message": "Group couldn't be found"
      })
    }

    const allEvents = await Event.findAll({
      where:{
        groupId:req.params.groupId
      },
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

  router.post('/:groupId/events',requireAuth, async (req,res)=>{
    const group = await Group.findOne({
      where:{
        id:req.params.groupId
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
        groupId:req.params.groupId,
        userId:req.user.id
      }
    })

    if (group.organizerId !== req.user.id && !membership ){
      res.status(403)
        return res.json({
            "message": "Forbidden"
          })
    }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
      res.status(403)
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
    // if (!price || typeof price !== 'number') errorResult.errors.price = "Price is invalid"
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

    const newEvent = await Event.create({
        groupId:group.id,
        venueId: venueId? venueId:null,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })

    res.json(newEvent)

  })

  router.get('/:groupId/members', async (req,res)=>{
    const group = await Group.findOne({
      where:{
        id:req.params.groupId
      }
    })

    if (!group){
      res.status(404)
      return res.json({
        "message": "Group couldn't be found"
      })
    }

    let membership
    if (req.user){
       membership = await Membership.findOne({
        where:{
          groupId:req.params.groupId,
          userId:req.user.id
        }
      })
    }
    if ((req.user && group.organizerId == req.user.id) || (membership && membership.status == 'co-host' ) ){
      let oMembers = await Membership.findAll({
        attributes:{
          exclude:['createdAt','updatedAt']
        },
        where:{
          groupId:group.id
        }
      })

      let Members = []

      for (let member of oMembers){
        let user = await User.findOne({
          where:{
            id:member.userId
          },
          attributes:['id','firstName',"lastName"]
        })

        user = user.toJSON()

        user.Membership = {
          status:member.status
        }

        Members.push(user)
      }

      return res.json({Members})
    }else {
      let oMembers = await Membership.findAll({
        attributes:{
          exclude:['createdAt','updatedAt']
        },
        where:{
          groupId:group.id,
          status:{
            [Op.in]:['co-host','member']
          }
        }
      })

      let Members = []

      for (let member of oMembers){
        let user = await User.findOne({
          where:{
            id:member.userId
          },
          attributes:['id','firstName',"lastName"]
        })

        user = user.toJSON()

        user.Membership = {
          status:member.status
        }

        Members.push(user)
      }

      return res.json({Members})
    }
  })


  router.post('/:groupId/membership',requireAuth, async (req,res)=>{
    const group = await Group.findOne({
      where:{
        id:req.params.groupId
      }
    })

    if (!group){
      res.status(404)
      return res.json({
        "message": "Group couldn't be found"
      })
    }

    let membership = await Membership.findOne({
      where:{
        groupId:req.params.groupId,
        userId:req.user.id
      }
    })

    if (membership){
      res.status(400)
      if (membership.status == 'pending'){
        return res.json({
          "message": "Membership has already been requested"
        })
      }else{
        return res.json({
          "message": "User is already a member of the group"
        })
      }
    }else{
      const newMember = await Membership.create({
        userId:req.user.id,
        groupId:req.params.groupId,
        status:'pending'
      })

      let returnMem = {
        memberId:newMember.userId,
        status:newMember.status
      }

      return res.json(returnMem)
    }

  })

  router.put('/:groupId/membership', requireAuth, async (req,res)=>{
    const group = await Group.findOne({
      where:{
        id:req.params.groupId
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
        groupId:req.params.groupId,
        userId:req.user.id
      }
    })

    const {memberId, status} = req.body

    const user = await User.findOne({
      where:{
        id:memberId
      }
    })

    const newMembership = await Membership.findOne({
      where:{
        groupId:req.params.groupId,
        userId:memberId
      }
    })

    if (status == 'pending'){
      res.status(400)
      return res.json({
        "message": "Validations Error",
        "errors": {
          "status" : "Cannot change a membership status to pending"
        }
      })
    }

    if (!user){
      res.status(400)
      return res.json({
        "message": "Validation Error",
        "errors": {
          "memberId": "User couldn't be found"
        }
      })
    }

    if (!newMembership){
      res.status(404)
      return res.json({
        "message": "Membership between the user and the group does not exist"
      })
    }




    if (req.body.status == 'member'){
         if (group.organizerId == req.user.id || (membership && membership.status == 'co-host')){
            newMembership.status = 'member'
            newMembership.save()
            res.json({
              memberId:memberId,
              status:'member'
            })
         }else{
          res.status(403)
        return res.json({
            "message": "Forbidden"
          })
         }
    }else{
      if (group.organizerId == req.user.id){
        newMembership.status = 'co-host'
            newMembership.save()
            res.json({
              memberId:memberId,
              status:'co-host'
            })
         }else{
          res.status(403)
        return res.json({
            "message": "Forbidden"
          })
         }
    }
  })


  router.delete('/:groupId/membership', requireAuth, async (req,res)=>{
    const {memberId} = req.body
    const member = await User.findOne({
      where:{
        id:memberId
      }
    })

    if (!member){
      res.status(400)
      return res.json({
        "message": "Validation Error",
        "errors": {
          "memberId": "User couldn't be found"
        }
      })
    }

    const group = await Group.findOne({
      where:{
        id:req.params.groupId
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
        userId:memberId,
        groupId:req.params.groupId
      }
    })

    if (!membership){
      res.status(404)
      return res.json({
        "message": "Membership does not exist for this User"
      })
    }

    if (group.organizerId == req.user.id || membership.userId == req.user.id){
      await membership.destroy()
      return res.json({
        "message": "Successfully deleted membership from group"
      })
    }else {
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }
  })









module.exports = router;
