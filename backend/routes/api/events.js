const express = require('express');
var validator = require('validator');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendance} = require('../../db/models');

const {requireAuth} = require('../../utils/auth')
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
                eventId:event.id
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
                eventId:event.id
            }
        })
        event.numAttending = numAttending



    res.json(event)
})

module.exports = router;
