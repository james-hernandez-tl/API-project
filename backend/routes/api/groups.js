const express = require('express');
const bcrypt = require('bcryptjs');
var validator = require('validator');


const { Sequelize, User, Group, Membership, GroupImage, Venue } = require('../../db/models');

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
      res.status(401)
        return res.json({
            "message": "Authentication required"
          })
    }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
      res.status(401)
        return res.json({
            "message": "Authentication required"
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
            "message": "Authentication required"
          })
    }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
      res.status(401)
        return res.json({
            "message": "Authentication required"
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




module.exports = router;
