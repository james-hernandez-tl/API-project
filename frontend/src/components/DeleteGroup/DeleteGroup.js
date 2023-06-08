import { useModal } from "../../context/Modal"
import { removeGroupThunk } from "../../store/allGroups"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import "./DeleteGroup.css"

export default function DeleteGroup(groupId){
    const history = useHistory()
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    console.log(groupId)

    const deleteGroupClicker = () => {
        dispatch(removeGroupThunk(groupId.groupId))
        closeModal()
        history.push(`/groups`)
    }

    const dontDeleteClicker = () => {
        closeModal()
    }
    return (
        <div className="delete-Group-main">
            <h3>Confrm Delete</h3>
            <div>Are you sure you want to remove this group?</div>
            <button onClick={deleteGroupClicker} className="DeleteGroup-delete-button">Yes (Delete Group)</button>
            <button onClick={dontDeleteClicker}>No (Keep Group)</button>
        </div>
    )
}
