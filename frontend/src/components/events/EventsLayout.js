import "./EventLayout.css";
import { useNavigate } from "react-router-dom";

export default function EventsLayout({ event, where }) {
  const time = event.startDate.split("T");
  const history = useNavigate();
  let prevImg = event.previewImage;

  const eventLayoutClicker = () => {
    history(`/events/${event.id}`);
  };

  return (
    <div className={`${where} eventLayout-main`} onClick={eventLayoutClicker}>
      <div className="EventsLayout-top-half">
        <div className="EventLayout-img">
          <img
            className="EventLayout-img-real"
            src={prevImg ?? "https://i.imgur.com/pXWL35P.png"}
            alt=""
          />
        </div>
        <div className="EventsLayout-top-half-text">
          <div>
            {time[0]}
            {" · "}
            {time[1]}
          </div>
          <div>{event.name}</div>
          <div>
            {event.Venue.state},{event.Venue.city}
          </div>
        </div>
      </div>
      <div className="EventsLayout-bottom-half">{event.description}</div>
    </div>
  );
}
