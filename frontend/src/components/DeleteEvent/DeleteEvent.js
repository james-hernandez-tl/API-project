import { useModal } from "../../context/Modal"
import { removeEventThunk } from "../../store/events"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import "./DeleteEvent.css"

export default function DeleteEvent(eventId){
    const history = useHistory()
    const dispatch = useDispatch()
    const {closeModal} = useModal()


    const deleteEventClicker = () => {
        dispatch(removeEventThunk(eventId.eventId))
        closeModal()
        history.push(`/groups/${eventId.groupId}`)
    }

    const dontDeleteClicker = () => {
        closeModal()
    }
    return (
        <div className="delete-event-main">
            <h3>Confrm Delete</h3>
            <div>Are you sure you want to remove this Event?</div>
            <button onClick={deleteEventClicker} className="DeleteEvent-delete-button">Yes (Delete Event)</button>
            <button onClick={dontDeleteClicker}>No (Keep Event)</button>
        </div>
    )
}
