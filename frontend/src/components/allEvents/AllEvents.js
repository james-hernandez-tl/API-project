import GroupHeader from "../Group-EventHeader/GroupHeader"
import { setEveryEventsThunk } from "../../store/events"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import EventsLayout from "../events/EventsLayout"

export default function AllEvents(){

    const dispatch = useDispatch()
    let allEvents = useSelector(state=> state.Events.allEvents)
    allEvents = Object.values(allEvents)
    allEvents = allEvents.sort((a,b)=>{
        const currentDate = new Date()
        const aDate = new Date(a.startDate.split("T")[0])
        const bDate = new Date(b.startDate.split("T")[0])

        if (currentDate > bDate) return false
        if (currentDate > aDate) return true
        if (aDate > bDate) return true
        return false
    })


    useEffect(()=>{
        dispatch(setEveryEventsThunk())
    },[dispatch])

    if (!allEvents.length) return null
    return (
        <div className="allEvents-main">
             <GroupHeader type={"events"}/>
             <div>Events in Meetup</div>
            {allEvents.map(event=>(
                <EventsLayout key={event.id} event={event} where={'everyEvent-layout'}/>
            ))}
        </div>
    )
}
