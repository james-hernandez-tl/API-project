import { useDispatch, useSelector } from "react-redux"
import { setAllGroupsThunk } from "../../store/allGroups"
import GroupLayout from "./GroupLayout"
import GroupHeader from "../Group-EventHeader/GroupHeader"
import "./index.css"
import { useEffect } from "react"

export default function AllGroups(){
    const dispatch = useDispatch()
    let allGroups = useSelector((state) => state.Groups.allGroups)
    allGroups = Object.values(allGroups)

    useEffect(()=> {
       dispatch(setAllGroupsThunk())
    },[dispatch])

    return (
        <div className="allGroups-main">
            <GroupHeader type={"groups"} />
            <div className="allGroups-heading">Groups in Meetup</div>
           {allGroups.map(group=>{
            if (group.id){
                return <GroupLayout key={group.id} group={group} />
            }
            return null
})}
        </div>
    )
}
