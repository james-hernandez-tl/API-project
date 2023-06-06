import "./Events.css"
import { setAllEventsThunk } from "../../store/events"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import EventsLayout from "./EventsLayout"


export default function Events({group}){
    const dispatch = useDispatch()
    let allEventsState = useSelector(state => state.Events.allEvents)
    let upCommingEvents = []
    let pastEvents = []

    useEffect(()=> {
        dispatch(setAllEventsThunk(group.id))
    },[group])

    const sortingEvents = (a,b) =>{
        let date1 = new Date(a.startDate)
        let date2 = new Date(b.startDate)
        // console.log(date1,date2)
        // console.log(date1 > date2)
        return date1 < date2
     }

    let allEvents = Object.values(allEventsState)
    allEvents = allEvents.sort(sortingEvents)
    // console.log("allevents",allEvents)

    allEvents.forEach(event => {
        let currentDate = new Date()
        let start = new Date(event.startDate)
        if (currentDate > start) pastEvents.push(event)
        else upCommingEvents.push(event)
    })

    return (
        <div className="events-main">
            <div className="events-content">
               <h2>Organizer</h2>
               <div>{group.Organizer.firstName+" "}{group.Organizer.lastName}</div>
               <h3>What were about</h3>
               <p>{group.about}</p>
            </div>
            {upCommingEvents.length > 0 && <h2>Upcoming Events ({upCommingEvents.length})</h2>}
            {upCommingEvents.length > 0 && upCommingEvents.map(event=> (
                <EventsLayout event={event} key={event.id} where={"EventsLayout"}/>
            )) }
            {pastEvents.length > 0 && <h2>Past Events ({pastEvents.length})</h2>}
            {pastEvents.length > 0 && pastEvents.map(event=> (
                <EventsLayout event={event} key={event.id} where={"EventsLayout"}/>
            )) }
        </div>
    )
}
