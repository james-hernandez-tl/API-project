import { useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { setEventThunk } from "../../store/events"
import { setGroupThunk } from "../../store/allGroups"
import DeleteEvent from "../DeleteEvent/DeleteEvent"
import OpenModalButton from "../OpenModalButton"
import { Link } from "react-router-dom"
import "./SingleEvent.css"

export default function SingleEvent() {
    const history = useHistory()
    const { eventId } = useParams()
    const dispatch = useDispatch()
    const event = useSelector(state => state.Events.singleEvent)
    const group = useSelector(state => state.Groups.singleGroup)
    const user = useSelector(state => state.session.user)

    const eventGroupClciker = () => {
        history.push(`/groups/${group.id}`)
    }

    let prevImg = event.previewImage
    if (event.EventImages){
        prevImg = event.EventImages.find(img => img.preview)
        prevImg = prevImg?prevImg.url:undefined
    }
    let groupPrevImg = group.previewImage

    useEffect(() => {
        dispatch(setEventThunk(eventId))
    }, [eventId,dispatch])

    useEffect(() => {
        if (event.groupId) dispatch(setGroupThunk(event.groupId))
    }, [event,dispatch])

    // useEffect()

    if (event.EventImages){
        prevImg = event.EventImages.find(img => img.preview)
        prevImg = prevImg? prevImg.url : undefined
    }

    if (!Object.values(event).length || !group.Organizer) return null
    return (
        <div className="singleEvent-main">
            <div className="singleEvent-header">
                <div> {"< "}<Link exact={"true"} to="/events">Events</Link> </div>
                <h2>{event.name}</h2>
                <div>Hosted by {` ${group.Organizer.firstName} ${group.Organizer.lastName}`} </div>
            </div>
            <div className="singleEvent-content">
                <div className="singleEvent-content-top-half">
                    <div><img className="singleEvent-deatail-img" src={prevImg??'https://i.imgur.com/pXWL35P.png'} alt="" /></div>
                    <div className="singleEvent-content-top-half-right">
                        <div className="singleEvent-content-top-half-right-top" onClick={eventGroupClciker}>
                            <div><img className="singleEvent-detail-group-img" src={groupPrevImg?prevImg:"https://i.imgur.com/2EGj2Rk.jpeg"} alt="" /></div>
                            <div>
                                <div>{group.name}</div>
                                <div>{group.private ? "Private" : "Public"}</div>
                            </div>
                        </div>
                        <div className="singleEvent-content-top-half-right-bottom">
                            <div>
                                <div><i className="fa-regular fa-clock"></i></div>
                                <div>
                                    <div>Start {` ${event.startDate.split("T")[0]} ·  ${event.startDate.split("T")[1]}`}</div>
                                    <div>End {` ${event.endDate.split("T")[0]} · ${event.endDate.split("T")[1]}`}</div>
                                </div>
                            </div>
                            <div>
                                <div><i className="fa-solid fa-dollar-sign"></i></div>
                                <div>{event.price > 0? event.price:"Free"}</div>
                            </div>
                            <div>
                                <div><i className="fa-solid fa-location-dot"></i></div>
                                <div className="singleEvent-button-holder"><div>{event.type}</div> <div>{user && user.id === group.organizerId && <button className="singleEvent-button">Update</button>}</div><div>{user && user.id === group.organizerId && <OpenModalButton buttonText="Delete" modalComponent={<DeleteEvent groupId={group.id} eventId={eventId} />}  />  }</div> </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="singleEvent-content-bottom-half">
                    <h2>Details</h2>
                    <div>{event.description}</div>
                </div>
            </div>
        </div>
    )
}
