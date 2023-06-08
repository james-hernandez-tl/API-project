import "./CreateGroupForm.css"
import GroupFormInput from "./GroupFormInput"

export default function CreateGroupForm(){
    return (
        <div className="CreateGroupForm-main">
            <div className="idk">CREATE A GROUP</div>
            <div>We'll walk you through a few steps to build your local community</div>
            <hr />
            <GroupFormInput formType={"Create"}/>
        </div>
    )
}
