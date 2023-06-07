import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect,useState } from "react"
import { setGroupThunk } from "../../store/allGroups"
import { Link } from "react-router-dom"
import "./singelGroup.css"
import Events from "../events/Events"


export default function SingelGroup(){
    const dispatch = useDispatch()
    const {groupId} = useParams()
    const group = useSelector( state => state.Groups.singleGroup)
    const user = useSelector(state => state.session.user)


    const singelGroupClicker = (e) => {
        e.preventDefault()

        alert("Feature Coming Soon...")
    }

    useEffect(()=>{
        dispatch(setGroupThunk(groupId))
    },[groupId])

    if (!Object.keys(group).length) return null

    let prevImg = group.GroupImages.find(imageObj => imageObj.preview)
    prevImg = prevImg? prevImg.url :undefined
    return (
        <>
        <div className="singleGroup-top-half">
             <Link exact={"true"} to="/groups">Groups</Link>
             <div className="singleGroup-top-half-main" >
                <div className="singleGroup-top-half-left">
                    <img className="singleGroup-top-half-left-img" src={prevImg?prevImg:"https://i.imgur.com/2EGj2Rk.jpeg"} alt="" />
                </div>
                <div className="singleGroup-top-half-right">
                    <h2>{group.name}</h2>
                    <div>{group.state}, {group.city}</div>
                    <div>{group.numMembers} Members · {group.private?"Private":"Public"}</div>
                    <div>Organized by {" "+group.Organizer.firstName+" "} {group.Organizer.lastName}</div>
                    {user && user.id !== group.organizerId && <button onClick={singelGroupClicker} className="singleGroup-button">Join this group</button>}
                    {user && user.id === group.organizerId && <div className="singleGroup-button-holder"> <button>Create Event</button> <button>Update</button> <button>Delete</button>  </div>}
                </div>
             </div>
        </div>
        <Events group={group}/>
        </>
    )
}
