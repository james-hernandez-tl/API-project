const express = require('express');
const bcrypt = require('bcryptjs');
var validator = require('validator');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage } = require('../../db/models');

const {requireAuth} = require('../../utils/auth')
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res)=>{
    const image = await EventImage.findByPk(req.params.imageId)
    console.log('one')
    if (!image){
        res.status(404)
        return res.json({
            "message": "Event Image couldn't be found"
          })
    }

    const event = await Event.findByPk(image.eventId)
    console.log('two')
    const group = await Group.findOne({
        where:{
          id:event.groupId
        }
      })
    console.log('three')
      if (!group){
        res.status(404)
        return res.json({
          "message": "Group couldn't be found"
        })
      }

      const membership = await Membership.findOne({
        where:{
          groupId:event.groupId,
          userId:req.user.id,
          status:'co-host'
        }
      })

      if (group.organizerId !== req.user.id && !membership ){
        res.status(403)
          return res.json({
              "message": "Forbidden"
            })
      }

      await image.destroy()
      res.json({
        "message": "Successfully deleted"
      })
})

module.exports = router;
