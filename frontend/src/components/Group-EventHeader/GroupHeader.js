import { Link } from "react-router-dom/cjs/react-router-dom.min"
import { useState } from "react"
import "./GroupHeader.css"

export default function GroupHeader({type}) {
    const [category,setCategory] = useState(type)

    const eventClicker = () => {
        setCategory("events")
    }

    const groupClicker = () => {
        setCategory("groups")
    }

    return (
        <div className="GroupHeader">
            <Link className={category === "events"?"active":"inActive"} exact={"true"} onClick={eventClicker} to="/events">Events</Link>
            <Link className={category === "groups"?"active":"inActive"} exact={"true"} onClick={groupClicker} to="/groups">Groups</Link>
        </div>
    )
}
