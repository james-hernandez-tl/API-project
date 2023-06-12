import GroupHeader from "../Group-EventHeader/GroupHeader"
import { setEveryEventsThunk } from "../../store/events"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import EventsLayout from "../events/EventsLayout"
import "./AllEvents.css"

export default function AllEvents(){

    const dispatch = useDispatch()
    let allEvents = useSelector(state=> state.Events.allEvents)
    allEvents = Object.values(allEvents)
    allEvents = allEvents.sort((a,b)=>{
        const currentDate = new Date()
        if (currentDate - a.startDate > 1) return 5
        return a.startDate - b.startDate
    })


    useEffect(()=>{
        dispatch(setEveryEventsThunk())
    },[dispatch])

    if (!allEvents.length) return null
    return (
        <div className="allEvents-main">
             <GroupHeader type={"events"}/>
             <div className="allEvents-heading">Events in Meetup</div>
            {allEvents.map(event=>(
                <EventsLayout key={event.id} event={event} where={'everyEvent-layout'}/>
            ))}
        </div>
    )
}
