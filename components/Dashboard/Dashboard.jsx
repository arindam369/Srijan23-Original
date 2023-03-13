import { database } from "@/firebase";
import AuthContext from "@/store/AuthContext";
import { notification } from "antd";
import { onValue, ref as ref_database, remove, update } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import styles from "../../styles/Dashboard.module.css";
import PolarChart from "../PolarChart";
import RegisteredEventBox from "./RegisteredEventBox";
import Workshop from "./Workshop";

export default function Dashboard(){
    const authCtx = useContext(AuthContext);
    const [registeredEventsUpdated, setRegisteredEventsUpdated] = useState(false);
    const [pendingEventsUpdated, setPendingEventsUpdated] = useState(false);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);

    useEffect(()=>{
        if(authCtx.userId){
            onValue(ref_database(database, 'srijan/profiles/' + authCtx.userId + '/events') , (snapshot)=>{
                if(snapshot){
                    let registeredEventsArray = [];
                    const allEvents = snapshot.val();
                    for(let event in allEvents){
                        if(allEvents[event].isRegistered === true){
                            registeredEventsArray.push({...allEvents[event], eventId: event});
                        }
                    }
                    setRegisteredEvents(registeredEventsArray);
                }
            }, {
                onlyOnce: true
            });
        }
    }, [authCtx.userId, registeredEventsUpdated])
    useEffect(()=>{
        if(authCtx.userId){
            onValue(ref_database(database, 'srijan/profiles/' + authCtx.userId + '/events') , (snapshot)=>{
                if(snapshot){
                    let pendingEventsArray = [];
                    const allEvents = snapshot.val();
                    for(let event in allEvents){
                        if(allEvents[event].isRegistered === false){
                            pendingEventsArray.push({...allEvents[event], eventId: event});
                        }
                    }
                    setPendingEvents(pendingEventsArray);
                }
            }, {
                onlyOnce: true
            });
        }
    }, [authCtx.userId, pendingEventsUpdated])

    function handleDeleteRegisteredEvent(eventId, eventName, teamName, teamLeader){
        setRegisteredEventsUpdated(!registeredEventsUpdated);
        notification['success']({
            message: `Event Registration deleted successfully`,
            duration: 2
        })
        update(ref_database(database, 'srijan/profiles/' + teamLeader + '/notifications/' + uuid()), {
            message: `You deleted the registration for Event-${eventId}`,
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
                    if(memberId !== teamLeader){
                        update(ref_database(database, 'srijan/profiles/' + memberId + '/notifications/' + uuid()), {
                            message: `Registration Deleted: ${teamLeader} deleted registration for Event: ${eventName}`,
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
    function handleDeletePendingEvent(eventId, eventName, teamName, teamLeader){
        setPendingEventsUpdated(!pendingEventsUpdated);
        notification['success']({
            message: `Event Registration deleted successfully`,
            duration: 2
        })
        update(ref_database(database, 'srijan/profiles/' + teamLeader + '/notifications/' + uuid()), {
            message: `You deleted the registration for Event: ${eventName}`,
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
                    if(memberId !== teamLeader){
                        update(ref_database(database, 'srijan/profiles/' + memberId + '/notifications/' + uuid()), {
                            message: `Invitation Deleted: ${teamLeader} deleted invitation for Event-${eventId}`,
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
            <div className={styles.dashboardProfilePage}>
                <div className={styles.dashboardProfileContainer}>
                    <div className={styles.dashboardDoughnutChart}>
                        <h2 className={styles.chartHeading}>Srijan'23 Events</h2>
                        <PolarChart/>
                    </div>
                    {/* <div className={styles.dashboardWorkshopContainer}>
                        <Workshop/>
                    </div> */}
                </div>

                <div className={styles.dashboardRegistrationContainer}>
                    <h2 className={styles.notificationHeading}>Registrations</h2>
                    <div className={styles.dashboardInvitations}>
                        <div className={styles.dashboardEventRequests}>
                            {registeredEvents && registeredEvents.length > 0 && registeredEvents.map((event)=>{

                                return (
                                    <RegisteredEventBox eventId={event.eventId} teamName={event.teamName} eventName={event.eventName} teamLeader={event.teamLeader} onDeleteEvent={()=>{handleDeleteRegisteredEvent(event.eventId, event.eventName, event.teamName, event.teamLeader)}} key={event.eventId} pending={false}/>
                                );
                            })}
                            {registeredEvents && registeredEvents.length === 0 && <div className={styles.noInvitations}>
                                <h4>No Registrations found</h4>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className={styles.dashboardRegistrationContainer}>
                    <h2 className={styles.notificationHeading}>Pending Registrations</h2>
                    <div className={styles.dashboardInvitations}>
                        <div className={styles.dashboardEventRequests}>
                            {pendingEvents && pendingEvents.length > 0 && pendingEvents.map((event)=>{
                                return (
                                    <RegisteredEventBox eventId={event.eventId} teamName={event.teamName} eventName={event.eventName} teamLeader={event.teamLeader} onDeleteEvent={handleDeletePendingEvent} key={event.eventId} pending={true}/>
                                );
                            })}
                            {pendingEvents && pendingEvents.length === 0 && <div className={styles.noInvitations}>
                                <h4>No Pending Registrations found</h4>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}