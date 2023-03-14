import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";
import Modal from "react-modal";
import { useState } from "react";
import { notification } from "antd";
import { ref as ref_database, update } from "firebase/database";
import { database } from "@/firebase";
import uuid from "react-uuid";

export default function UserDetailsBox({name, email, userId, dept, college, year, avatar}){
    const [visibleNotificationForm, setVisibleNotificationForm] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const toggleVisibleNotificationForm = ()=>{
        setVisibleNotificationForm(!visibleNotificationForm);
    }
    const customEventModalStyles = {
        overlay:{
          background: "rgba(0,0,0,0.65)",
          zIndex: "100"
        }
    };

    function handleSendNotification(){
        if(notificationText.trim().length === 0){
            notification['error']({
                message: `You must provide a notification text`,
                duration: 2
            })
            return;
        }
        else{
            update(ref_database(database, 'srijan/profiles/' + userId + '/notifications/' + uuid()), {
                message: `Admin: ${notificationText}`,
                timestamp: Date.now()
            }).then(()=>{
                notification['success']({
                    message: `Notification sent successfully`,
                    duration: 2
                })
            });
            setNotificationText("");
            toggleVisibleNotificationForm();
        }
    }

    return (
        <>
            <Modal
                isOpen={visibleNotificationForm}
                onRequestClose={() => {
                    toggleVisibleNotificationForm();
                }}
                className={styles.sendNotificationModal}
                ariaHideApp={false}
                style={customEventModalStyles}
                closeTimeoutMS={700}
            >
                <div>
                    <h2 className={styles.notificationUserId}>Sending Notification to {userId}</h2>
                    <textarea cols="30" rows="5" placeholder="Write a notification" className={styles.notificationTextarea} onChange={(e)=>{setNotificationText(e.target.value)}}/>
                    <div className={styles.sendNotificationButton2} onClick={handleSendNotification}>Send</div>
                </div>
            </Modal>
            <div className={styles.userDetailsBox}>
                <div className={styles.userDetailsTop}>
                    <Image src={avatar? avatar: "/assets/anonymous.jpg"} height={50} width={50} alt="user_avatar" className={styles.userDetailsAvatar}/>
                    <h4>{userId}</h4>
                </div>
                <div className={styles.userDetailsMid}>
                    <p>Name: <span>{name}</span></p>
                    <p>Email: <span>{email}</span></p>
                    <p>Dept: <span>{dept}</span></p>
                    <p>College: <span>{college}</span></p>
                    <p>Graduation Year: <span>{year}</span></p>
                </div>
                <div className={styles.userDetailsBottom}>
                    <div className={styles.sendNotificationButton} onClick={toggleVisibleNotificationForm}>Send Notification</div>
                </div>
            </div>
        </>
    )
}