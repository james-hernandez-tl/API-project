import { useState, useEffect, startTransition } from "react"
import { useHistory } from "react-router-dom"
import { createGroupThunk } from "../../store/allGroups"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import "./CreateEventForm.css"
import { createEventThunk } from "../../store/events"


export default function CreateEventForm() {
    const history = useHistory()
    const dispatch = useDispatch()
    const {groupId} = useParams()
    const group = useSelector(state=> state.Groups.allGroups[groupId])

    const [eventName,setEventName] = useState("")
    const [type,setType] = useState("")
    const [privateOrPublic, setPrivateOrPublic] = useState("")
    const [price,setPrice] = useState("")
    const [eventStart,setEventStart] = useState("")
    const [eventEnd,setEventEnd ] = useState("")
    const [describe,setDescription] = useState("")
    const [image,setImage] = useState("")
    const [errors,setErrors] = useState({})
    const [submited,setSubmited] = useState(false)

    const EventNameChanger = (e) => {
        setEventName(e.target.value)
    }

    const typeChanger = (e) => {
        setType(e.target.value)
    }

    const priavteChanger = (e) => {
        setPrivateOrPublic(e.target.value)
    }

    const priceChanger = (e) => {
        setPrice(e.target.value)
    }

    const startChanger = (e) => {
        setEventStart(e.target.value)
    }

    const endChanger = (e) => {
        setEventEnd(e.target.value)
    }

    const describeChanger = (e) => {
        setDescription(e.target.value)
    }

    const imageChanger = (e) => {
        setImage(e.target.value)
    }


    useEffect(()=>{

        const newErrors = {}

        if (!eventName.length) newErrors.name = "Name is required"
        if (type !== "Online" && type!=="In person") newErrors.type = "type is required"
        if (privateOrPublic !== "Private" && privateOrPublic !== "Public") newErrors.private = "Visibility is required"
        if (!price) newErrors.price = "Price is required"
        if (eventStart.split(" ") < 3 ) newErrors.start = "Date and hour required"
        if (!eventStart.length) newErrors.start = "Event start is required"
        if (eventEnd.split(" ") < 3 ) newErrors.end = "Date and hour required"
        if (!eventEnd.length) newErrors.end = "Event end is required"
        if (!image.endsWith(".png") && !image.endsWith(".jpg") && !image.endsWith(".jpeg")) newErrors.image = "Image URL must end in .png, .jpg, or .jpeg"
        if (describe.length < 50) newErrors.describe = "Description must be at least 50 characters long"

       setErrors(newErrors)

    },[eventName,type,privateOrPublic,price,eventStart,eventEnd,image,describe])

     const submitform = async (e) => {
        e.preventDefault()
        if (Object.values(errors).length) {
            setSubmited(true)
            return
        }

      const newEvent = {
        name:eventName,
        type:type,
        price,price,
        description:describe,
        startDate:new Date(eventStart),
        endDate:new Date(eventEnd),
        url:image,
        groupId:groupId
      }

      const finalEvent = await dispatch(createEventThunk(newEvent))

      history.push(`/events/${finalEvent.id}`)

     }



    return (
        <form onSubmit={submitform}>
            <h2>Create an event for {}</h2>
            <div>What is the name of your event?</div>
            <input type="text" placeholder="event name" value={eventName} onChange={EventNameChanger}></input>
            <div className="createEvent-erros">{submited && errors.name}</div>
            <hr />
            <div>Is this an in person or online event?</div>
            <select value={type} onChange={typeChanger}>
                <option value="" disabled >(select one)</option>
                <option value="In person" >In person</option>
                <option value="Online">Online</option>
            </select>
            <div className="createEvent-erros">{submited && errors.type}</div>

            <div>Is this event private or public?</div>
            <select value={privateOrPublic} onChange={priavteChanger}>
                <option value="" disabled >(select one)</option>
                <option value="Private" >Private</option>
                <option value="Public">Public</option>
            </select>
            <div className="createEvent-erros">{submited && errors.private}</div>

            <div>What is the price for your event?</div>
            <div>
                <div><i className="fa-solid fa-dollar-sign"></i></div>
                <input placeholder="0" type="number" value={price} onChange={priceChanger} />
            </div>
            <div className="createEvent-erros">{submited && errors.price}</div>

            <hr />

            <div>When does your event start?</div>
            <div>
                <input placeholder="MM/DD/YYYY HH:mm AM" type="text" value={eventStart} onChange={startChanger}/>
                <div><i className="fa-regular fa-calendar-days"></i></div>
            </div>
            <div className="createEvent-erros">{submited && errors.start}</div>

            <div>When does your event end?</div>
            <div>
                <input placeholder="MM/DD/YYYY HH:mm AM" type="text" value={eventEnd} onChange={endChanger}/>
                <div><i className="fa-regular fa-calendar-days"></i></div>
            </div>
            <div className="createEvent-erros">{submited && errors.end}</div>

            <hr />

            <div>Please add in image url for your event below:</div>
            <input placeholder="Image url" type="text" value={image} onChange={imageChanger} />
            <div className="createEvent-erros">{submited && errors.image}</div>

            <hr />

            <div>Please describe your event:</div>
            <textarea placeholder="Please include at least 50 characters" value={describe} onChange={describeChanger} cols="30" rows="10"></textarea>
            <div className="createEvent-erros">{submited && errors.describe}</div>

            <button type="submit">Create Event</button>
        </form>
    )
}
