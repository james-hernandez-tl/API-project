import "./EventLayout.css"
import { useHistory } from "react-router-dom"

export default function EventsLayout({event,where}){
    const time= event.startDate.split("T")
    const history = useHistory()

    const eventLayoutClicker = () => {
        history.push(`/events/${event.id}`)
    }

    return (
       <div className={where} onClick={eventLayoutClicker}>
          <div className="EventsLayout-top-half">
              <div className="EventLayout-img">mid img</div>
              <div>
                <div>{time[0]}{" · "}{time[1]}</div>
                <div>{event.name}</div>
                <div>{event.Venue.state},{event.Venue.city}</div>
              </div>
          </div>
          <div className="EventsLayout-bottom-half">
                {event.description}
          </div>
       </div>
    )
}
