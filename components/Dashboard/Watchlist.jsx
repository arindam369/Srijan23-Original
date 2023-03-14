import styles from "../../styles/Dashboard.module.css";
import EventBox from "./EventBox";
import AuthContext from "@/store/AuthContext";
import { useState, useEffect, useContext } from "react";
import {IoMdSearch, IoMdClose} from "react-icons/io";

export default function Watchlist(){
    const authCtx = useContext(AuthContext);
    const userData = authCtx.userData;
    const userId = userData && userData.email && userData.email.split("@")[0].replace(/[.+-]/g, "_");
    const [sortedInterestedEvents, setSortedInterestedEvents] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [visibleSearchBar, setVisibleSearchBar] = useState(false);
    
    const toggleSearchBar = ()=>{
        setSearchInput("");
        setVisibleSearchBar(!visibleSearchBar);
    }

    useEffect(()=>{
        if(authCtx.interestedEvents){
            setSortedInterestedEvents(authCtx.interestedEvents.filter( event => {
                if(searchInput.trim() === ""){
                    return event;
                }
                else if(event.eventName.toLowerCase().includes(searchInput.trim().toLowerCase())){
                    return event;
                }
            }));
        }
    }, [searchInput, authCtx.interestedEvents])


    return(
        <>
            <div className={styles.eventsContainer}>
                <div className={styles.eventsContainerBox}>
                    <div className={styles.dashboardSectionHeading}>
                        My Watchlist
                    </div>
                    <div className={styles.dashboardSearchBox}>
                        <div className={styles.dashboardEventSearch}>
                            {<input type="text" placeholder="Search Event" className={visibleSearchBar? "visibleSearchInput visibleInput" : "visibleSearchInput"} value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}/>}
                            {!visibleSearchBar && <IoMdSearch className={styles.eventSearchIcon} onClick={toggleSearchBar}/>}
                            {visibleSearchBar && <IoMdClose className={styles.eventSearchIcon} onClick={toggleSearchBar}/>}
                        </div>
                    </div>
                    <div className={styles.dashboardInterestedEvents}>
                        {
                            sortedInterestedEvents && sortedInterestedEvents.length>0 && sortedInterestedEvents.map((interestedEvent)=>{
                                return (
                                    <EventBox key={interestedEvent.eventId} eventId={interestedEvent.eventId} eventName={interestedEvent.eventName} eventDate={interestedEvent.eventDate} eventInterested={interestedEvent.eventInterested} eventRegistered={interestedEvent.eventRegistered} eventPoster={interestedEvent.eventPoster} eventHashtags={interestedEvent.eventHashtags} eventShortDescription={interestedEvent.eventShortDescription}/>
                                )
                            })
                        }
                        {sortedInterestedEvents && sortedInterestedEvents.length === 0 && 
                            <div className={styles.noEventsFound}>No Event Found</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}