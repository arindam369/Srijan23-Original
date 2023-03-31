import { events } from "./events";
import { merchandiseAdmins } from "./merchandiseAdmins";

export const getEventById = (eventID)=>{
    const foundEvent = events.filter(eventData => eventData.eventId === eventID);
    return foundEvent[0];
}
export const getMerchandiseAdminById = (merchandiseID)=>{
    const foundMerchant = merchandiseAdmins.filter(merchandiseData => merchandiseData.merchantId === merchandiseID);
    return foundMerchant[0];
}