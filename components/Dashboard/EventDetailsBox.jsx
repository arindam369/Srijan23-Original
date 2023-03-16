import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";
import Modal from "react-modal";
import { useState } from "react";
import { notification } from "antd";
import { ref as ref_database, update } from "firebase/database";
import { database } from "@/firebase";
import uuid from "react-uuid";

export default function EventDetailsBox({eventName, eventId}){
    const [visibleNotificationForm, setVisibleNotificationForm] = useState(false);
    const toggleVisibleNotificationForm = ()=>{
        setVisibleNotificationForm(!visibleNotificationForm);
    }
    const customEventModalStyles = {
        overlay:{
          background: "rgba(0,0,0,0.65)",
          zIndex: "100"
        }
    };

    return (
        <>
            <div className={styles.userDetailsBox}>
                {/* <div className={styles.userDetailsTop}>
                    <Image src={avatar? avatar: "/assets/anonymous.jpg"} height={50} width={50} alt="user_avatar" className={styles.userDetailsAvatar}/>
                    <h4>{userId}</h4>
                </div> */}
                {/* <div className={styles.userDetailsMid}>
                    <p>Name: <span>{name}</span></p>
                    <p>Email: <span>{email}</span></p>
                    <p>Dept: <span>{dept}</span></p>
                    <p>College: <span>{college}</span></p>
                    <p>Graduation Year: <span>{year}</span></p>
                </div> */}
                {/* <div className={styles.userDetailsBottom}>
                    <div className={styles.sendNotificationButton} onClick={toggleVisibleNotificationForm}>Send Notification</div>
                </div> */}
            </div>
        </>
    )
}