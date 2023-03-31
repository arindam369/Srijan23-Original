import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import { getEventById } from "@/helper/event-utils";
import { events } from "@/helper/events";
import styles from "../../../styles/Dashboard.module.css";
import AuthContext from "@/store/AuthContext";
import RegisterPage2 from "@/components/Register/Register2";
import { admins } from "@/helper/admins";
import PermissionDeniedPage from "@/components/PermissionError";

function AdminEventDetailsPage({ eventData }) {
  const authCtx = useContext(AuthContext);

  if(!authCtx.isAuthenticated){
    return (
        <RegisterPage2/>
    )
  }
  if(!admins[`${eventData.eventId}`].includes(authCtx.userId)){
    return (
        <PermissionDeniedPage/>
    )
  }

  if (!eventData) {
    return <h2 className={styles.noEventsFound}>No Event Found</h2>;
  }

  const [teamDetails, setTeamDetails] = useState([]);

  useEffect(() => {
    authCtx.stopLoading();
    onValue(
      ref_database(database, `srijan/events/${eventData.eventId}/teams`),
      (snapshot) => {
        if (snapshot) {
          let teamDetailsArray = [];
          const teamDetailsResult = snapshot.val();
          for (let team in teamDetailsResult) {
            teamDetailsArray.push({ ...teamDetailsResult[team], teamId: team });
          }
          setTeamDetails(teamDetailsArray);
        }
      },
      {
        onlyOnce: true,
      }
    );
  }, []);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="The wait is over for the 15th edition of SRIJAN, Jadavpur University, Kolkata's largest and most awaited Techno-Management Fest."
        />
        <meta
          name="keywords"
          content="srijan, cultural, ju, fest, srijanju, technology, events, games, coding, srijan23, techfest"
        />
        <meta name="author" content="FETSU" />
        <link rel="manifest" href="manifest.json" />
        <title>SRIJAN'23 | Admin</title>

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="SRIJAN'23 | Jadavpur University" />
        <meta
          property="og:description"
          content="The wait is over for the 15th edition of SRIJAN, Jadavpur University, Kolkata's largest and most awaited Techno-Management Fest."
        />
        <meta property="og:url" content="https://srijanju.in" />
        <meta
          property="og:site_name"
          content="SRIJAN'23 | Jadavpur University"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://srijanju.in/favicon2.ico"
        />
        <link rel="shortcut icon" href="../../favicon2.ico" type="image/x-icon" />
        <link rel="icon" type="image/x-icon" href="../../favicon2.ico" />
      </Head>
      <div className={styles.canvasContainer}>
        <Canvas>
          <Stars />
          <OrbitControls
            enableZoom={false}
            enableRotate={false}
            enableDamping={false}
            enablePan={false}
            rotateSpeed={0.4}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 15, 10]} angle={0.3} />
        </Canvas>
      </div>

      <div className={styles.dashboardPageContainer}>
        <div className={styles.dashboardSectionHeading2}>
          {eventData.eventName} Database
        </div>
        {teamDetails && (
          <div className={styles.dashboardSectionHeading3}>
            {teamDetails.length} Registered
          </div>
        )}
        <br />
        <div className={styles.userDetailsContainer}>
          {teamDetails &&
            teamDetails.length > 0 &&
            teamDetails.map((team, idx) => {
              return (
                <div className={styles.adminEventDetailsBox} key={idx}>
                  <div className={styles.eventDetailsTop}>
                    <h4>{team.teamDetails && team.teamDetails.teamName}</h4>
                  </div>
                  <div className={styles.userDetailsMid}>
                    <p>
                      Lead Mobile:{" "}
                      <span>
                        {team.teamDetails && team.teamDetails.leadContact}
                      </span>
                    </p>
                    <p>
                      Lead Email:{" "}
                      <span>
                        {team.teamDetails && team.teamDetails.leadEmail}
                      </span>
                    </p>
                    {team.teamDetails &&
                      team.teamDetails.members &&
                      team.teamDetails.members.length > 0 &&
                      team.teamDetails.members.map((teamMember, idx) => {
                        return (
                          <div key={idx} className={styles.teamMemberData}>
                            <p>
                              Member{idx + 1}:{" "}
                              <p
                                className={
                                  teamMember.status
                                    ? "registeredUser"
                                    : "pendingUser"
                                }
                              >
                                {teamMember.email}
                              </p>
                            </p>
                          </div>
                        );
                      })}
                  </div>
                  {/* <div className={styles.userDetailsBottom}>
                      <div className={styles.sendNotificationButton} onClick={toggleVisibleNotificationForm}>Send Notification</div>
                  </div> */}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
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
export default AdminEventDetailsPage;