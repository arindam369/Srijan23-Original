import { events } from "./events";

export const getEventById = (eventID)=>{
    const foundEvent = events.filter(eventData => eventData.eventId === eventID);
    return foundEvent[0];
}