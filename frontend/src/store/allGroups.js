import { csrfFetch } from "./csrf";

//TYPES

const SETALLGROUPS = "allGroups/setGroup"

const CREATEGROUP = "allGroups/createGroup"

const REMOVEGROUP = "allGroups/removeGroup"

const UPDATEGROUP = "allGroups/updateGroup"

const SETGROUP = "allGroup/setGroup"

// Action

const setAllGroupsAction = (allGroups) => {
    return {
        type:SETALLGROUPS,
        allGroups
    }
}

const setGroupAction = (group) => {
    return {
        type:SETGROUP,
        group
    }
}


const createGroupAction = (group) => {
    return {
        type:CREATEGROUP,
        group
    }
}

const removeGroupAction = (groupId) => {
    return {
        type:REMOVEGROUP,
        groupId
    }
}

const updateGroupAction = (group) => {
    return {
        type:UPDATEGROUP,
        group
    }
}

// thunk

export const removeGroupThunk = (groupId) => async (dispatch) => {
   await csrfFetch(`/api/groups/${groupId}`,{
    method:"DELETE"
   })
   await dispatch(removeGroupAction(groupId))
}

export const updateGroupThunk = (group) => async (dispatch) => {
   let updatedGroup = await csrfFetch(`/api/groups/${group.groupId}`,{
       method:"PUT",
       headers:{"Content-Type":"application/json"},
       body:JSON.stringify({
            name:group.name,
            about:group.about,
            type:group.type,
            private:group.private,
            city:group.city,
            state:group.state
       })
   })

   updatedGroup = await updatedGroup.json()

   dispatch(updateGroupAction(updatedGroup))

   return updatedGroup
}

export const setAllGroupsThunk = () => async (dispatch) => {
    let allGroups = await csrfFetch("/api/groups")
    allGroups = await allGroups.json()
    dispatch(setAllGroupsAction(allGroups.Groups))
}

export const setGroupThunk = (groupId) => async (dispatch) => {
    let group = await csrfFetch(`/api/groups/${groupId}`)
    group = await group.json()
    dispatch(setGroupAction(group))
}

export const createGroupThunk = (group) => async (dispatch) => {
    let newGroup = await csrfFetch(`/api/groups`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:group.name,
            about:group.about,
            type:group.type,
            private:group.private,
            city:group.city,
            state:group.state
          })
    })

    newGroup = await newGroup.json()

    const obj = {
        url:group.url,
        groupId:newGroup.id
    }

    const image = await dispatch(addGroupImageThunk(obj))

    dispatch(createGroupAction({...newGroup,previewImage:image.url,numMembers:0}))

    // let group2 = await csrfFetch(`/api/groups/${newGroup.id}`)
    // group2 = await group2.json()
    // dispatch(setGroupAction(group2))

    return newGroup

}

export const addGroupImageThunk = (obj) => async (dispatch) => {
    let image = await csrfFetch(`/api/groups/${obj.groupId}/images`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            url:obj.url,
            preview:true
        })
    })

    image = image.json()

    return image
}


// reducer

const initalState = {
    allGroups: {},
    singleGroup: {}
}

const normalizer = async () => {
    let allGroups = await csrfFetch("/api/groups")
    allGroups = await allGroups.json()
    // console.log("allG",allGroups)
    allGroups.Groups.forEach(group => {
        initalState.allGroups[group.id]=group
    })
    initalState.allGroups.optionalOrderedList = []
}

await normalizer()
// console.log("in",initalState)

// {
//     allGroups: {
//       [groupId]: {
//         groupData,
//       },
//       optionalOrderedList: [],
//     },
//     singleGroup: {
//       groupData,
//       GroupImages: [imagesData],
//       Organizer: {
//         organizerData,
//       },
//       Venues: [venuesData],
//     },
//   }

const allGroupsReducer = (state = initalState,action) => {
    const newState = {...state,allGroups:{...state.allGroups}}
    switch (action.type){
        case SETALLGROUPS:{
            action.allGroups.forEach(group => {
                newState.allGroups[group.id] = group
            })
            // newState.allGroups.optionalOrderedList = []
            return newState
        }
        case CREATEGROUP:{
            newState.allGroups[action.group.id] = action.group
            return newState
        }
        case SETGROUP :{
            newState.singleGroup = action.group
            return newState
        }
        case REMOVEGROUP:{
            delete newState.allGroups[action.groupId]
            newState.singleGroup = {}
            return newState
        }
        case UPDATEGROUP:{
           return {...state,allGroups:{...state.allGroups,[action.group.id]:{...state.allGroups[action.group.id],...action.group}}}
        }
        default:{
            return state
        }
    }
}

export default allGroupsReducer
