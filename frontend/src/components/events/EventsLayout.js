import "./EventLayout.css"

export default function EventsLayout({event}){
    const time= event.startDate.split("T")
    return (
       <div className="EventsLayout">
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
