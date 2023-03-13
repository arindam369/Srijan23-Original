import { database, storage } from "@/firebase";
import { onValue, ref as ref_database } from "firebase/database";
import {getDownloadURL, getMetadata, ref as ref_storage} from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";
import RegisteredEventCard from "./RegisteredEventCard";
import AuthContext from "@/store/AuthContext";
import { useRouter } from "next/router";
import {RiDeleteBack2Fill} from "react-icons/ri";
import { message, Popconfirm } from 'antd';

export default function RegisteredEventBox({eventId, teamName, eventName, teamLeader, onDeleteEvent, pending}){
    const [eventTeamMembers, setEventTeamMembers] = useState([]);

    const authCtx = useContext(AuthContext);
    const router = useRouter();
    useEffect(()=>{
        onValue(ref_database(database, 'srijan/events/'+eventId+'/teams/'+teamName) , async (snapshot)=>{
            if(snapshot){
                if(snapshot.val() !== null){
                    setEventTeamMembers(snapshot.val().teamDetails.members);
                }
            }
        })
    }, [])

    const goToEventPage = (eventId)=>{
        authCtx.startLoading();
        router.push(`/dashboard/events/${eventId}`);
    }

    const confirm = (e) => {
        message.success(`${eventId} registration deleted`);
        onDeleteEvent();
    };

    return (
        <div key={eventId} className={styles.eventRegisteredBox}>
            {pending && <div className={styles.eventPendingAnimation}/>}
            <h2 className={styles.eventRegisteredName}>{eventName}</h2>
            {authCtx.userId === teamLeader && 
            <Popconfirm
                title="Delete Registration"
                description="Are you sure you want to delete this registration?"
                onConfirm={confirm}
                okText="Delete"
                cancelText="Cancel"
            >
                <RiDeleteBack2Fill className={styles.deleteEventIcon}/>
            </Popconfirm>}
            <Image height={50} width={100} src={`https://firebasestorage.googleapis.com/v0/b/srijan23-dev.appspot.com/o/events%2F${eventId}.jpg?alt=media&token=c84ad773-122e-4171-b9b6-263daa6f0212`} draggable={false} className={styles.eventRegisteredImage} alt="eventImage"/>
            <div className={styles.eventMemberButtonBox}>
                <div className={styles.eventTeamMembers}>
                    {eventTeamMembers && eventTeamMembers.map((eventMember)=>{
                        return (
                            <RegisteredEventCard eventMember={eventMember} key={eventMember.email}/>
                        )
                    })}
                </div>
                <div className={styles.exploreEventButton2} onClick={()=>{goToEventPage(eventId)}}>Explore Event</div>
            </div>
        </div>
    );
}