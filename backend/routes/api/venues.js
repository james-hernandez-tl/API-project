const express = require('express');
const bcrypt = require('bcryptjs');
var validator = require('validator');


const { User, Group, Membership, GroupImage, Venue } = require('../../db/models');

const {requireAuth} = require('../../utils/auth')
const router = express.Router();

router.put('/:venueId', requireAuth, async (req,res)=>{
    const venue = await Venue.findOne({
        where:{
            id:req.params.venueId
        },
        attributes:{
            exclude:['updatedAt','createdAt']
        }
    })

    if (!venue) {
        res.status(404)
        res.json({
            "message": "Venue couldn't be found"
          })
    }

    const group = await Group.findOne({
        where:{
          id:venue.groupId
        }
      })

      const membership = await Membership.findOne({
        where:{
          groupId:venue.groupId,
          userId:req.user.id
        }
      })

      if (group.organizerId !== req.user.id && !membership ){
        res.status(401)
          res.json({
              "message": "Authentication required"
            })
      }else if (group.organizerId !== req.user.id && membership.status !== "co-host"){
        res.status(401)
          res.json({
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
        res.json(errorResult)
      }

      venue.address = address
      venue.city = city
      venue.state = state
      venue.lat = lat
      venue.lng = lng

      venue.save()

    res.json(venue)
})


module.exports = router;
