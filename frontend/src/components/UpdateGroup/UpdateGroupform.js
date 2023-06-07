import GroupFormInput from "../CreateGroupForm/GroupFormInput"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

export default function UpdateGroupForm(){
    const {groupId} = useParams()
    const group = useSelector(state => state.Groups.allGroups[groupId])

    return (
       <div>
          <div>UPDATE YOUR GROUP'S INFORMATION</div>
          <h2>We'll walk you through a few steps to update your group's information</h2>
          <hr />
          <GroupFormInput formType={"Update"} currentGroup={group} />
       </div>
    )
}
