import { database } from "@/firebase";
import { getEventById } from "@/helper/event-utils";
import { events } from "@/helper/events";
import { onValue, ref as ref_database } from "firebase/database";
import { useEffect, useState } from "react";
import styles from "../../../styles/Dashboard.module.css";

export default function AdminEventDetailsPage({eventData}){
    if (!eventData) {
        return <h2 className={styles.noEventsFound}>No Event Found</h2>;
    }

    const [teamDetails, setTeamDetails] = useState([]);

    useEffect(()=>{      
      onValue(ref_database(database, `srijan/events/${eventData.eventId}/teams`) , (snapshot)=>{
          if(snapshot){
              let teamDetailsArray = [];
              const teamDetailsResult = snapshot.val();
              for(let team in teamDetailsResult){
                  teamDetailsArray.push({...teamDetailsResult[team], teamId: team});
              }
              setTeamDetails(teamDetailsArray);
          }
      }, {
          onlyOnce: true
      });
  }, [])

    return (
      <div className={styles.dashboardPageContainer}>
        <div className={styles.dashboardSectionHeading2}>{eventData.eventName} Database</div>
        {teamDetails && <div className={styles.dashboardSectionHeading3}>{teamDetails.length} Registered</div>}
        {
          teamDetails && teamDetails.length>0 && teamDetails.map((team)=>{
            return (
                <div className={styles.adminTeamDetailsBox} key={team.teamId}>
                  <p>Team: {team.teamDetails && team.teamDetails.teamName} ----- {team.isRegistered? "Registered: True": "Registered: False"}</p>
                  <p>Team Lead Contact: {team.teamDetails && team.teamDetails.leadContact}</p>
                  <p>Team Lead Email: {team.teamDetails && team.teamDetails.leadEmail}</p>
                  {team.teamDetails && team.teamDetails.members && team.teamDetails.members.length>0 && team.teamDetails.members.map((teamMember, idx)=>{
                    return (
                      <div key={idx}>
                        <p>Member{idx}: {teamMember.email} ----- {teamMember.status?"Status: True": "Status: False"}</p>
                      </div>
                    )
                  })}
                </div>
            );
          })
        }


      </div>
    )
}

export async function getStaticProps(context) {
    const { params } = context;
    const eventID = params.eventId;
    const event = getEventById(eventID);
    const notFound = event ? false : true;

    return { props: { eventData: event }, notFound };
  }
  export async function getStaticPaths() {
    const eventsArray = events;
    const eventID_path =
      eventsArray &&
      eventsArray.map((event) => ({
        params: { eventId: event.eventId },
      }));
  
    return {
      paths: eventID_path,
      fallback: true,
    };
  }
  