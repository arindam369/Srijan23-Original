import { useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import EventBox from "./EventBox";
import {IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";
import { events } from "@/helper/events";
import { useEffect } from "react";

export default function Events(){

    
    // const [eventIndex, setEventIndex] = useState(0);

    // const goLeft = ()=>{
    //     if(eventIndex===0){
    //         setEventIndex(events.length-1);
    //     }
    //     else{
    //         setEventIndex((eventIndex-1)%events.length);
    //     }
    // }
    // const goRight = ()=>{
    //     setEventIndex((eventIndex+1)%events.length);
    // }

    const [visibleSortBox, setVisibleSortBox] = useState(false);
    const [sortedType, setSortedType] = useState("all-events");
    const [sortedEventType, setSortedEventType] = useState("All Events");
    const [sortedEvents, setSortedEvents] = useState(null);

    useEffect(()=>{
        if(sortedType === "all-events"){
            setSortedEvents(events);
        }
        else{
            setSortedEvents(events.filter((eventData)=>(eventData.eventType === sortedType)));
        }
    }, [sortedType])

    const toggleSortBox = ()=>{
        setVisibleSortBox(!visibleSortBox);
    }
    const showEvents = (eventType)=>{
        setSortedType(eventType);
        if(eventType === "all-events"){
            setSortedEventType("All Events");
        }
        else if(eventType === "coding"){
            setSortedEventType("Coding");
        }
        else if(eventType === "gaming"){
            setSortedEventType("Gaming");
        }
        else if(eventType === "circuit-robotics"){
            setSortedEventType("Circuit & Robotics");
        }
        else if(eventType === "business-management"){
            setSortedEventType("Business & Management");
        }
        else if(eventType === "brainstorming"){
            setSortedEventType("Brainstorming");
        }
        else if(eventType === "misc"){
            setSortedEventType("Misc");
        }
        setVisibleSortBox(false);
    }

    return (
        <>
            <div className={styles.eventsContainer}>
                <div className={styles.eventsContainerBox}>
                    <div className={styles.dashboardSectionHeading}>Events</div>

                    <div className={styles.eventCollection}>
                        {
                            sortedEvents && sortedEvents.map((eventData)=>{
                                return (
                                    <EventBox key={eventData.eventId} eventId={eventData.eventId} eventName={eventData.eventName} eventDate={eventData.eventDate} eventInterested={eventData.eventInterested} eventRegistered={eventData.eventRegistered} eventPoster={eventData.eventPoster} eventHashtags={eventData.eventHashtags}/>
                                )
                            })
                        }
                        {sortedEvents && sortedEvents.length === 0 && <div className={styles.noEventsFound}>No Events Found</div>}
                        {/* <EventBox key={events[eventIndex].id} eventName={events[eventIndex].eventName} eventDate={events[eventIndex].eventDate} eventInterested={events[eventIndex].eventInterested} eventRegistered={events[eventIndex].eventRegistered} eventPoster={events[eventIndex].eventPoster} eventHashtags={events[eventIndex].eventHashtags}/> */}


                        {/* <IoIosArrowDropleft className={styles.talksArrowIconLeft} onClick={goLeft}/> */}
                        {/* <IoIosArrowDropright className={styles.talksArrowIconRight} onClick={goRight}/> */}
                    </div>

                    <div className={styles.eventSortBox}>
                        <div className={styles.selectedSortedEvent} onClick={toggleSortBox}>{sortedEventType}</div>
                        {visibleSortBox && <div className={styles.sortedEventList}>
                            <li onClick={()=>{showEvents("all-events")}}>All Events</li>
                            <li onClick={()=>{showEvents("coding")}}>Coding</li>
                            <li onClick={()=>{showEvents("gaming")}}>Gaming</li>
                            <li onClick={()=>{showEvents("circuit-robotics")}}>Circuits & Robotics</li>
                            <li onClick={()=>{showEvents("business-management")}}>Business & Management</li>
                            <li onClick={()=>{showEvents("brainstorming")}}>Brainstorming</li>
                            <li onClick={()=>{showEvents("misc")}}>Misc</li>
                        </div>}
                    </div>


                    {/* <div className={styles.eventsRadioBox}>
                        {
                            events.map((event, id)=>{
                                return (
                                    <input type="radio" name="eventIndex" checked={eventIndex===id} onChange={()=>setEventIndex(id)}/>
                                )
                            })
                        }
                    </div> */}
                </div>
            </div>
        </>
    );
}