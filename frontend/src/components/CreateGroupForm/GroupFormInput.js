import { useState, useEffect } from "react"
import "./GroupFormInput.css"
import { useHistory } from "react-router-dom"
import { createGroupThunk } from "../../store/allGroups"
import { useDispatch } from "react-redux"
import { updateGroupThunk } from "../../store/allGroups"

export default function GroupFormInput({formType, currentGroup}){
    const [cityState, setCityState] = useState("")
    const [groupName,setGroupName] = useState("")
    const [description,setDescription] = useState("")
    const [type,setType] = useState("")
    const [privateOrPublic,setPrivateOrPublic] = useState("")
    const [imageUrl,setImageUrl] = useState("")
    const [triedSubmit,setTriedSubmit] = useState(false)
    const [errors,setErrors] = useState({})
    const history = useHistory()
    const dispatch = useDispatch()

    // onchange
    const cityChanger = (e) => {
       setCityState(e.target.value)
    }

    const groupNameChanger = (e) => {
      setGroupName(e.target.value)
   }

   const descriptionChanger = (e) => {
    setDescription(e.target.value)
 }

   const typeChanger = (e) => {
    setType(e.target.value)
   }

   const privateChanger = (e) => {
    setPrivateOrPublic(e.target.value)
   }

   const imageUrlChanger = (e) => {
    setImageUrl(e.target.value)
   }

   const submition = async (e) => {
      setTriedSubmit(true)
      e.preventDefault()
      if (Object.keys(errors).length){
        return
      }
      let newGroup = {
        name:groupName,
        about:description,
        type:type,
        private:privateOrPublic === "Private",
        city:cityState.split(",")[0],
        state:cityState.split(",")[1],
        url:imageUrl,
        groupId: currentGroup? currentGroup.id:undefined,
      }
      let finalGroup
      if (formType === "Create"){
         finalGroup = await dispatch(createGroupThunk(newGroup))
      }else {
         finalGroup = await dispatch(updateGroupThunk(newGroup))
      }

      history.push(`/groups/${finalGroup.id}`)

   }

   useEffect(()=>{
      const newErrors = {}
      if (!cityState.includes(",")) newErrors.location = "need both city and state"
      if (!cityState.length) newErrors.location = "Location is required"
      if (!groupName.length) newErrors.groupName = "Name is required"
      if (description.length < 50) newErrors.description = "Description must be at least 50 characters long"
      if (!imageUrl.endsWith(".png") && !imageUrl.endsWith(".jpg") && !imageUrl.endsWith(".jpeg")) newErrors.image = "Image URL must end in .png, .jpg, or .jpeg "
      if (type !== "Online" && type !== "In person") newErrors.type = "Group Type is required"
      if (privateOrPublic !== "Private" && privateOrPublic !== "Public") newErrors.private = 'Visibility Type is required'

      setErrors(newErrors)
   },[cityState,groupName,description,type,privateOrPublic,imageUrl])

   useEffect(()=>{
      if (formType === "Update"){
          setCityState(`${currentGroup.city},${currentGroup.state}`)
          setGroupName(currentGroup.name)
          setDescription(currentGroup.about)
          setPrivateOrPublic(currentGroup.private?"Private":"Public")
          setType(currentGroup.type)
          setImageUrl(currentGroup.previewImage??"https://i.imgur.com/2EGj2Rk.jpeg")
      }
   },[])

    return (
         <form onSubmit={submition} >
             <div>
                 <h2>First, set your group's location.</h2>
                 <div>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online</div>
                 <input type="text" value={cityState} onChange={cityChanger} placeholder="City, STATE"/>
                 <div className="groupErrors">{triedSubmit && errors.location}</div>
                 <hr />
                 <h2>What will your group's name be?</h2>
                 <div>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</div>
                 <input type="text" value={groupName} onChange={groupNameChanger} placeholder="What is your group name?"/>
                 <div className="groupErrors">{triedSubmit && errors.groupName}</div>
                 <hr />
                 <h2>Now describe what your group will be about</h2>
                 <div>People will see this when we promote your group, but you'll be able to add to it later, too.</div>
                 <ol>
                    <li>What's the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                 </ol>
                 <textarea type="text" value={description} onChange={descriptionChanger} placeholder="Please write at least 50 characters"/>
                 <div className="groupErrors">{triedSubmit && errors.description}</div>
                 <hr />

                 <h2>Final step...</h2>
                 <div>Is this an in person or online group?</div>
                 <select value={type} onChange={typeChanger} id="">
                    <option value="" disabled >( select one )</option>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                 </select>
                 <div className="groupErrors">{triedSubmit && errors.type}</div>
                 <div>Is this group private or public?</div>
                 <select value={privateOrPublic} onChange={privateChanger}>
                    <option value="" disabled >( select one )</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                 </select>
                 <div className="groupErrors">{triedSubmit && errors.private}</div>
                 {formType === "Create" && <div>Please add an image url for your group below:</div>}
                 {formType === "Create" && <input type="text" value={imageUrl} onChange={imageUrlChanger} placeholder="Image Url"/>}
                 {formType === "Create" && <div className="groupErrors">{triedSubmit && errors.image}</div>}
                 <hr />
                 <button>{formType} group</button>
             </div>
         </form>
    )
}
