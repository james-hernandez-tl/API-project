const express = require('express');
const bcrypt = require('bcryptjs');
var validator = require('validator');


const { User, Group, Membership, GroupImage, Venue } = require('../../db/models');

const {requireAuth} = require('../../utils/auth')
const router = express.Router();


router.delete('/:imageId', requireAuth, async (req,res)=>{
    const image = await GroupImage.findByPk(req.params.imageId)
    if (!image){
        res.status(404)
        return res.json({
            "message": "Group Image couldn't be found"
          })
    }
    const group = await Group.findOne({
        where:{
          id:image.groupId
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
          groupId:image.groupId,
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
