import { useContext, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import EventBox from "./EventBox";
import {IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";
import {IoMdSearch, IoMdClose} from "react-icons/io";
import { events } from "@/helper/events";
import { useEffect } from "react";
import AuthContext from "@/store/AuthContext";

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
    const authCtx = useContext(AuthContext);

    const [visibleSortBox, setVisibleSortBox] = useState(false);
    const [sortedType, setSortedType] = useState("all-events");
    const [sortedEventType, setSortedEventType] = useState("All Events");
    const [sortedEvents, setSortedEvents] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [visibleSearchBar, setVisibleSearchBar] = useState(false);

    const toggleSearchBar = ()=>{
        setSearchInput("");
        setVisibleSearchBar(!visibleSearchBar);
    }

    useEffect(()=>{
        if(sortedType === "all-events"){
            setSortedEvents(events);
        }
        else if(sortedType === "registered"){
            setSortedEvents(authCtx.registeredEvents);
        }
        else if(sortedType === "unregistered"){
            setSortedEvents(events.filter(eventData => !authCtx.registeredEvents.includes(eventData)));
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
            setSortedType("all-events");
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
        else if(eventType === "registered"){
            setSortedEventType("Registered");
        }
        else if(eventType === "unregistered"){
            setSortedEventType("Not Registered");
        }
        setVisibleSortBox(false);
    }

    useEffect(()=>{
        if(events){
            setSortedEventType("All Events");
            setSortedEvents(events.filter( event => {
                if(searchInput.trim() === ""){
                    return event;
                }
                else if(event.eventName.toLowerCase().includes(searchInput.trim().toLowerCase())){
                    return event;
                }
            }));
        }
    }, [searchInput])

    return (
        <>
            <div className={styles.eventsContainer}>
                <div className={styles.eventsContainerBox}>
                    <div className={styles.dashboardSectionHeading}>Events</div>

                    <div className={styles.dashboardSearchBox}>
                        <div className={styles.dashboardEventSearch}>
                            {<input type="text" placeholder="Search Event" className={visibleSearchBar? "visibleSearchInput visibleInput" : "visibleSearchInput"} value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}/>}
                            {!visibleSearchBar && <IoMdSearch className={styles.eventSearchIcon} onClick={toggleSearchBar}/>}
                            {visibleSearchBar && <IoMdClose className={styles.eventSearchIcon} onClick={toggleSearchBar}/>}
                        </div>
                    </div>

                    <div className={styles.eventCollection}>
                        {
                            sortedEvents && sortedEvents.map((eventData)=>{
                                return (
                                    <EventBox key={eventData.eventId} eventId={eventData.eventId} eventName={eventData.eventName} eventDate={eventData.eventDate} eventInterested={eventData.eventInterested} eventRegistered={eventData.eventRegistered} eventPoster={eventData.eventPoster} eventHashtags={eventData.eventHashtags} eventShortDescription={eventData.eventShortDescription} isRegistered={authCtx.registeredEvents.includes(eventData)}/>
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
                            <li onClick={()=>{showEvents("registered")}}>Registered</li>
                            <li onClick={()=>{showEvents("unregistered")}}>Not Registered</li>
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