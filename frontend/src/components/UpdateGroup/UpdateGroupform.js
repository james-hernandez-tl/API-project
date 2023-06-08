import { useEffect } from "react"
import GroupFormInput from "../CreateGroupForm/GroupFormInput"
import { useSelector } from "react-redux"
import { useParams,useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function UpdateGroupForm(){
    const history = useHistory()
    const {groupId} = useParams()
    const group = useSelector(state => state.Groups.allGroups[groupId])
    const user = useSelector(state => state.session.user)

    useEffect(()=>{
      if (user.id !== group.organizerId) {
        history.push("/")
      }
    },[])


    return (
       <div>
          <div>UPDATE YOUR GROUP'S INFORMATION</div>
          <h2>We'll walk you through a few steps to update your group's information</h2>
          <hr />
          <GroupFormInput formType={"Update"} currentGroup={group} />
       </div>
    )
}
