import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";
import {AiOutlineUserAdd} from "react-icons/ai";
import {MdFavorite} from "react-icons/md";
import {BsFillCalendarCheckFill} from "react-icons/bs";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "@/store/AuthContext";

export default function EventBox({eventId, eventName, eventDate, eventInterested, eventRegistered, eventPoster, eventHashtags, eventShortDescription}){

    const router = useRouter();
    const authCtx = useContext(AuthContext);

    const goToEventPage = ()=>{
        authCtx.startLoading();
        router.push(`/dashboard/events/${eventId}`);
    }

    return (
        <>
            <div className={styles.eventBox}>

                
                <div className={styles.eventImageBox}>
                    <Image src={eventPoster} height={200} width={300} alt="event_image" className={styles.eventImage} draggable={false}/>
                </div>


                <div className={styles.eventBodyBox}>
                    <h2 className={styles.eventBodyTitle}>{eventName}</h2>
                    {/* <div className={styles.eventBodyDate}>
                        <BsFillCalendarCheckFill/>
                        <div>{eventDate && eventDate.prelims && eventDate.prelims.length===1?eventDate.prelims[0] : eventDate.prelims && eventDate.prelims.map((prelimsDate)=>{
                            return (<span>{prelimsDate} &ensp;</span>);
                        })}</div>
                        <div>
                            {eventDate && eventDate.fullday}
                        </div>
                    </div> */}
                    {/* <div className={styles.eventUserDetails}>
                        <div className={styles.eventInterested}>
                            <MdFavorite/>
                            <div>{eventInterested} Interested</div>
                        </div>
                        <div className={styles.eventRegistered}>
                            <AiOutlineUserAdd/> 
                            <div>{eventRegistered} Registered</div>
                        </div>
                    </div> */}
                    {eventShortDescription && <div className={styles.eventShortDescription}>
                        &emsp;{eventShortDescription}
                    </div>}
                    <div className={styles.eventBodyTypes}>
                        {eventHashtags && eventHashtags.map((hashtag, id)=>{
                            return (
                                <h5 key={id}>{hashtag}</h5>
                            )
                        })}
                    </div>
                    <div className={styles.exploreEventButton} onClick={goToEventPage}>Explore Event</div>
                </div>


            </div>
        </>
    )
}