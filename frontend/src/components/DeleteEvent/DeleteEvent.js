import { useModal } from "../../context/Modal"
import { removeEventThunk } from "../../store/events"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"

export default function DeleteEvent(eventId){
    const history = useHistory()
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    console.log("event",eventId)

    const deleteEventClicker = () => {
        dispatch(removeEventThunk(eventId.eventId))
        closeModal()
        history.push(`/groups/${eventId.groupId}`)
    }

    const dontDeleteClicker = () => {
        closeModal()
    }
    return (
        <div>
            <h3>Confrm Delete</h3>
            <div>Are you sure you want to remove this Event?</div>
            <button onClick={deleteEventClicker} className="DeleteGroup=delete-button">Yes (Delete Event)</button>
            <button onClick={dontDeleteClicker}>No (Keep Event)</button>
        </div>
    )
}
