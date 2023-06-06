import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect,useState } from "react"
import { setGroupThunk } from "../../store/allGroups"


export default function SingelGroup(){
    const dispatch = useDispatch()
    const {groupId} = useParams()
    const group = useSelector( state => state.Groups.singelGroup)

    useEffect(()=>{
        dispatch(setGroupThunk(groupId))
    })



    return (
        <div>SingelGroup</div>
    )
}
