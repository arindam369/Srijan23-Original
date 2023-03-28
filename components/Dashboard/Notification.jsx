import { database } from "@/firebase";
import { getTimeDifference } from "@/helper/login-utils";
import AuthContext from "@/store/AuthContext";
import { notification } from "antd";
import { onValue, ref as ref_database, remove, update } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import styles from "../../styles/Dashboard.module.css";

export default function Notification(){
    const authCtx = useContext(AuthContext);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [eventAccepted, setEventAccepted] = useState(false);
    const [userNotifications, setUserNotifications] = useState([]);

    useEffect(()=>{
        if(authCtx.userId){
            onValue(ref_database(database, 'srijan/profiles/' + authCtx.userId + '/events') , (snapshot)=>{
                if(snapshot){
                    let pendingEventsArray = [];
                    const interestedEvents = snapshot.val();
                    for(let event in interestedEvents){
                        if(interestedEvents[event].status === false){
                            pendingEventsArray.push({...interestedEvents[event], eventId: event});
                        }
                    }
                    setPendingEvents(pendingEventsArray);
                }
            }, {
                onlyOnce: true
            });
        }
    }, [authCtx.userId, eventAccepted])

    useEffect(()=>{
        if(authCtx.userId){
            onValue(ref_database(database, 'srijan/profiles/' + authCtx.userId + '/notifications') , (snapshot)=>{
                if(snapshot){
                    let notificationArray = [];
                    const notificationValues = snapshot.val();
                    for(let notification in notificationValues){
                        notificationArray.push({...notificationValues[notification], id: notification});
                    }
                    notificationArray.sort((a, b)=>{
                        return (b.timestamp - a.timestamp);
                    });
                    setUserNotifications(notificationArray);
                }
            }, {
                onlyOnce: true
            });
        }
    }, [authCtx.userId, eventAccepted])


    function acceptInvitation(userId, eventId, eventName, teamLeader, teamName){
        if(!authCtx.userData.name ||!authCtx.userData.email || !authCtx.userData.phone || !authCtx.userData.college || !authCtx.userData.dept || !authCtx.userData.year){
            notification['error']({
                message: `Complete your profile to accept the invitation`,
                duration: 2
            })
            return;
        }
        update(ref_database(database, 'srijan/profiles/' + userId + '/events/'+eventId), {
            status: true
        }).then(()=>{
            setEventAccepted(!eventAccepted);
            notification['success']({
                message: `Invitation accepted successfully`,
                duration: 2
            })
            update(ref_database(database, 'srijan/profiles/' + userId + '/notifications/' + uuid()), {
                message: `You accepted ${teamLeader}'s invitation for the event: '${eventName}'`,
                timestamp: Date.now()
            });

            onValue(ref_database(database, 'srijan/events/' + eventId + '/teams/' +teamName+"/teamDetails/members") , (snapshot)=>{
                if(snapshot){
                    let membersArray = [];
                    const memberValues = snapshot.val();
                    for(let member in memberValues){
                        membersArray.push(memberValues[member]);
                    }
                    // do : verified: true --> now check, whether every members are verified or not
                    // if all are verified: true then update regitered: true in team, user profile data
                    for(let i=0; i<membersArray.length; i++){
                        if(membersArray[i].email.split("@")[0].replace(/[.+-]/g, "_") === userId){
                            membersArray[i].status = true;
                            break;
                        }
                    }
                    let canBeRegistered = true;
                    for(let i=0; i<membersArray.length; i++){
                        if(membersArray[i].status === false){
                            canBeRegistered = false;
                            break;
                        }
                    }
                    for(let i=0; i<membersArray.length; i++){
                        const memberId = membersArray[i].email.split("@")[0].replace(/[.+-]/g, "_");
                        if(memberId !== userId){
                            update(ref_database(database, 'srijan/profiles/' + memberId + '/notifications/' + uuid()), {
                                message: `${userId} accepted ${teamLeader}'s invitation for the event: '${eventName}'`,
                                timestamp: Date.now()
                            });
                        }
                    }
                    if(canBeRegistered){
                        notification['success']({
                            message: `Event registered successfully`,
                            duration: 2
                        })
                        for(let i=0; i<membersArray.length; i++){
                            const memberId = membersArray[i].email.split("@")[0].replace(/[.+-]/g, "_");
                            update(ref_database(database, 'srijan/profiles/' + memberId + '/notifications/' + uuid()), {
                                message: `Registration Successful: You have successfully registered in the event: '${eventName}'`,
                                timestamp: Date.now()
                            });
                        }
                        update(ref_database(database, 'srijan/events/'+eventId+"/teams/"+teamName), {
                            isRegistered: true
                        }).then(()=>{
                            for(let i=0; i<membersArray.length; i++){
                                update(ref_database(database, 'srijan/profiles/' + membersArray[i].email.split("@")[0].replace(/[.+-]/g, "_") + '/events/'+eventId), {
                                    isRegistered: true
                                })
                            }
                        });

                    }
                    update(ref_database(database, 'srijan/events/'+eventId+"/teams/"+teamName+"/teamDetails"), {
                        members: membersArray
                    });
                }
            }, {
                onlyOnce: true
            });
        });
    }
    function rejectInvitation(userId, eventId, eventName, teamLeader, teamName){
        if(!authCtx.userData.name ||!authCtx.userData.email || !authCtx.userData.phone || !authCtx.userData.college || !authCtx.userData.dept || !authCtx.userData.year){
            notification['error']({
                message: `Complete your profile to reject the invitation`,
                duration: 2
            })
            return;
        }
        setEventAccepted(!eventAccepted);
        notification['success']({
            message: `Invitation rejected successfully`,
            duration: 2
        })
        update(ref_database(database, 'srijan/profiles/' + userId + '/notifications/' + uuid()), {
            message: `You rejected ${teamLeader}'s invitation for the event: '${eventName}'`,
            timestamp: Date.now()
        });

        onValue(ref_database(database, 'srijan/events/' + eventId + '/teams/' +teamName+"/teamDetails/members") , (snapshot)=>{
            if(snapshot){
                let membersArray = [];
                const memberValues = snapshot.val();
                for(let member in memberValues){
                    membersArray.push(memberValues[member]);
                }
                // go to every userId's events and remove this eventId
                for(let i=0; i<membersArray.length; i++){
                    const memberId = membersArray[i].email.split("@")[0].replace(/[.+-]/g, "_");
                    const memberEventRef = ref_database(database, `srijan/profiles/${memberId}/events/${eventId}`);
                    remove(memberEventRef);
                    if(memberId !== userId){
                        update(ref_database(database, 'srijan/profiles/' + memberId + '/notifications/' + uuid()), {
                            message: `Registration Failed: ${userId} rejected ${teamLeader}'s invitation for the event: '${eventName}'`,
                            timestamp: Date.now()
                        });
                    }
                }
                // after complete removing, delete events/eventId/teamName
                const eventIdRemoveRef = ref_database(database, `srijan/events/${eventId}/teams/${teamName}`);
                remove(eventIdRemoveRef);
            }
        }, {
            onlyOnce: true
        });
    }

    return (
        <>
            <div className={styles.dashboardNotificationsContainer}>
            <div className={styles.dashboardNotifications}>
                    <h2 className={styles.notificationHeading}>Invitations</h2>
                    <div className={styles.dashboardInvitations}>
                        <div className={styles.dashboardEventRequests}>
                            {pendingEvents && pendingEvents.length > 0 && pendingEvents.map((event)=>{
                                return (
                                    <div key={event.eventId} className={styles.eventRequestBox}>
                                        <h2 className={styles.eventRequestName}>{event.eventName}</h2>
                                        <p className={styles.eventRequestText}>&ensp;<b>{event.teamLeader}</b> invites you to join in this event</p>
                                        {authCtx && authCtx.userId && <div className={styles.acceptRejectbuttonBox}>
                                            <button className={styles.acceptButton} onClick={()=>{acceptInvitation(authCtx.userId, event.eventId, event.eventName, event.teamLeader, event.teamName)}}>Accept</button>
                                            <button className={styles.rejectButton} onClick={()=>{rejectInvitation(authCtx.userId, event.eventId, event.eventName, event.teamLeader, event.teamName)}}>Reject</button>
                                        </div>}
                                    </div>
                                );
                            })}
                            {pendingEvents && pendingEvents.length === 0 && <div className={styles.noInvitations}>
                                <h4>No Invitations found</h4>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className={styles.dashboardNotifications}>
                    <h2 className={styles.notificationHeading}>Notifications</h2>
                    <div className={styles.notificationsContainer}>
                        {userNotifications && userNotifications.length>0 && userNotifications.map((userNotification)=>{
                            return (
                                <div key={userNotification.id} className={styles.userNotification}>
                                    <h4 className={styles.notificMessage}>{userNotification.message}</h4>
                                    <h6 className={styles.notificTimestamp}>{getTimeDifference(userNotification.timestamp)}</h6>
                                </div>
                            )
                        })}
                        {userNotifications && userNotifications.length===0 && <div className={styles.noInvitations}>
                                <h4>No Notifications found</h4>
                            </div>}
                    </div>
                </div>
            </div>
        </>
    )
}