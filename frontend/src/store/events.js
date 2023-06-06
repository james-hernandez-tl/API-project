import { csrfFetch } from "./csrf";

//TYPES

const SETALLEVENTS = "events/setAllEvents"

const CREATEEVENTS = "events/createEvent"

const REMOVEEVENT = "events/removeEvent"

const SETEVENT = "events/setEvent"

// Action

const setAllEventsAction = (allEvents) => {
    return {
        type:SETALLEVENTS,
        allEvents
    }
}

const setEventAction = (event) => {
    return {
        type:SETEVENT,
        event
    }
}


const createEventAction = (event) => {
    return {
        type:CREATEEVENTS,
        event
    }
}

const removeEventAction = (eventId) => {
    return {
        type:REMOVEEVENT,
        eventId
    }
}

// thunk

export const setAllEventsThunk = (groupId) => async (dispatch) => {
    let allEvents = await csrfFetch(`/api/groups/${groupId}/events`)
    allEvents = await allEvents.json()
    dispatch(setAllEventsAction(allEvents.Events))
}

export const setEventThunk = (eventId) => async (dispatch) => {
    let event = await csrfFetch(`/api/events/${eventId}`)
    event = await event.json()
    dispatch(setEventAction(event))
}


// reducer

const initalState = {
    allEvents: {},
    singleEvent: {}
}

// const normalizer = async () => {
//     let allGroups = await csrfFetch("/api/groups")
//     allGroups = await allGroups.json()
//     // console.log("allG",allGroups)
//     allGroups.Groups.forEach(group => {
//         initalState.allGroups[group.id]=group
//     })
//     initalState.allGroups.optionalOrderedList = []
// }

// await normalizer()
// console.log("in",initalState)

// events: {
//     allEvents: {
//       [eventId]: {
//         eventData,
//         Group: {
//           groupData,
//         },
//         Venue: {
//           venueData,
//         },
//       },
//     },
//     // In this slice we have much more info about the event than in the allEvents slice.
//     singleEvent: {
//       eventData,
//       Group: {
//         groupData,
//       },
//       // Note that venue here will have more information than venue did in the all events slice. (Refer to your API Docs for more info)
//       Venue: {
//         venueData,
//       },
//       EventImages: [imagesData],
//       // These would be extra features, not required for your first 2 CRUD features
//       Members: [membersData],
//       Attendees: [attendeeData],
//     },
//   },

const allEventsReducer = (state = initalState,action) => {
    const newState = {...state,allEvents:{}}
    switch (action.type){
        case SETALLEVENTS:{
            action.allEvents.forEach(event => {
                newState.allEvents[event.id] = event
            })
            // newState.allGroups.optionalOrderedList = []
            return newState
        }
        case CREATEEVENTS:{
            newState.allEvents[action.event.id] = action.event
            return newState
        }
        case SETEVENT :{
            newState.singleEvent = action.event
            return newState
        }
        case REMOVEEVENT:{
            delete newState.allEvents[action.eventId]
            return newState
        }
        default:{
            return state
        }
    }
}

export default allEventsReducer
