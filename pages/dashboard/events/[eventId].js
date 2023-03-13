import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import homeStyles from "../../../styles/Home.module.css";
import { getEventById } from "@/helper/event-utils";
import { events } from "@/helper/events";
import styles from "../../../styles/Dashboard.module.css";
import { MdDescription, MdPlace } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { FaRegDotCircle, FaBookOpen } from "react-icons/fa";
import EventPosters from "@/components/Dashboard/EventPosters";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { useState } from "react";
import Modal from "react-modal";
import EventRegistration from "@/components/Dashboard/EventRegistration";
import { makeEventInterested, makeEventUnInterested } from "@/helper/login-utils";
import { useContext } from "react";
import AuthContext from "@/store/AuthContext";
import { useEffect } from "react";
import { notification } from "antd";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function EventDetailsPage({ eventData }) {
  // console.log(eventData);

  if(!eventData){
    return <h2>No Event Found</h2>;
  }
  const [userInterested, setUserInterested] = useState(false);
  const [visibleRegistrationModal, setVisibleRegistrationModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(()=>{
    authCtx.stopLoading();
  }, [])

  const makeUserInterested = () => {
    if(authCtx.userId){
      if(!userInterested){
        setUserInterested(true);
        const userId = authCtx.userId;
        makeEventInterested(userId, eventData.eventId, eventData.eventName);
        setTimeout(()=>{
          authCtx.refetchInterestedEvents();
        }, 5000)
        notification['success']({
          message: `Event added to Watchlist`,
          duration: 2
        })
      }
      else{
        setUserInterested(false);
        const userId = authCtx.userId;
        makeEventUnInterested(userId, eventData.eventId, eventData.eventName);
        setTimeout(()=>{
          authCtx.refetchInterestedEvents();
        }, 5000)
        notification['success']({
          message: `Event removed from Watchlist`,
          duration: 2
        })
      }
    }
  };

  const toggleVisibleRegistrationForm = ()=>{
    setVisibleRegistrationModal(!visibleRegistrationModal);
  }
  const customEventModalStyles = {
    overlay:{
      background: "rgba(0,0,0,0.65)",
      zIndex: "100"
    }
  };

  useEffect(()=>{
    authCtx.interestedEvents && authCtx.interestedEvents.find((event)=>{
      if(event && event.eventId === eventData.eventId){
        setUserInterested(true);
      }
    })
  }, [authCtx.interestedEvents])

  useEffect(()=>{  
    onValue(ref_database(database, 'srijan/profiles/' + authCtx.userId + '/events/'+eventData.eventId) , (snapshot)=>{
      // console.log(snapshot && snapshot.val());
      if(snapshot){
        if(snapshot.val() !== null){
          setIsRegistered(true);
        }
      }
    }, {
        onlyOnce: true
    });
  }, [])

  const handleRegisterEvent = ()=>{
    setIsRegistered(true);
  }
  const router = useRouter();
  const goToLoginPage = ()=>{
    router.push("/register");
  }

  return (
    <>
      <Modal
        isOpen={visibleRegistrationModal}
        onRequestClose={() => {
          toggleVisibleRegistrationForm();
        }}
        className={styles.eventRegistrationModal}
        ariaHideApp={false}
        style={customEventModalStyles}
        closeTimeoutMS={700}
      >
        <EventRegistration eventName={eventData.eventName} eventId={eventData.eventId} minMembers={eventData.minMembers} maxMembers={eventData.maxMembers} toggleVisibleRegistrationForm={toggleVisibleRegistrationForm} onRegister={handleRegisterEvent}/>
      </Modal>


      <div className={homeStyles.canvasContainer}>
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

      <div className={styles.dashboardContainer}>
        <div className={styles.eventDetailsContainer}>
          <div className={styles.eventDetailsContainerBox}>
            <div className={styles.eventDetailsHeading}>
              {eventData.eventName}
            </div>

            <div className={styles.eventDetailsBody}>
              <div className={styles.eventDetailsSection}>
                <div className={styles.eventDetailsSectionHeading}>
                  <MdDescription className={styles.eventDetailsIcon} />
                  <div>Description</div>
                </div>

                <div className={styles.eventDetailsSectionText}>
                  {
                    eventData.eventDescription && eventData.eventDescription.map((eventDescLine, idx)=>{
                      return (<p key={idx}>&emsp;{eventDescLine}</p>)
                    })
                  }
                </div>
              </div>

              <div className={styles.eventDetailsMidbox}>
                <div className={styles.eventDetailsLeft}>
                  {/* <div className={styles.eventPosterCollection}>
                    <EventPosters />
                  </div> */}
                    <Image src={eventData.eventPoster} height={350} width={500} alt="eventPosterImage" className={ styles.eventPosterImage} draggable={false}/>
                </div>

                <div className={styles.eventDetailsRight}>
                  <div className={styles.eventDetailsHalfSection}>
                    <div className={styles.eventDetailsSectionHeading}>
                      <FaBookOpen className={styles.eventDetailsIcon} />
                      <div>Rules & Guidelines</div>
                    </div>

                    <div className={styles.eventDetailsSectionText}>
                      {eventData.eventRules && eventData.eventRules.map((eventRule, idx)=>{
                        return (
                          <li key={idx}>
                            <FaRegDotCircle
                              className={styles.eventDetailsBulletIcon}
                            />
                            <div>
                              {eventRule}
                            </div>
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.eventFullDescription}>
                Wanna know more about this event? <Link href={"https://docs.google.com/document/d/1EgT55EllzRdAJP2n9i-pLoD9b0GL0uxLlunEMA2gLvg/edit"} className={styles.eventDescLink}>Click Here</Link>
              </div>

              <div className={styles.eventEndBox}>
                <div className={styles.eventDetailsDateDiv}>
                  <div className={styles.eventDetailsPrelimsFinals}>
                    {eventData &&
                    eventData.eventDate &&
                    eventData.eventDate.prelims &&
                    eventData.eventDate.prelims.length === 1 ? (
                      <div className={styles.eventDetailsDateTextIcons}>
                        <BsFillCalendarCheckFill />
                        <span className={styles.eventDetailsDateText}>
                          <span className={styles.eventDetailsDateTitle}>
                            Prelims:
                          </span>{" "}
                          <span className={styles.eventDetailsDateTextAns}>
                            {" "}
                            {eventData.eventDate.prelims[0]}
                            {eventData.eventTime && " [ "+eventData.eventTime.prelims[0]+" ]"}
                          </span>
                        </span>
                      </div>
                    ) : (
                      eventData.eventDate.prelims &&
                      eventData.eventDate.prelims.map(
                        (prelimsDate, prelimsId) => {
                          return (
                            <div className={styles.eventDetailsDateTextIcons} key={prelimsId}>
                              <BsFillCalendarCheckFill />
                              <span className={styles.eventDetailsDateText}>
                                <span className={styles.eventDetailsDateTitle}>
                                  Prelims{prelimsId + 1}:
                                </span>{" "}
                                <span
                                  className={styles.eventDetailsDateTextAns}
                                >
                                  {prelimsDate}
                                  {eventData.eventTime && " [ "+eventData.eventTime.prelims[prelimsId]+" ]"}
                                </span>
                              </span>
                            </div>
                          );
                        }
                      )
                    )}
                    {eventData.eventDate && eventData.eventDate.fullday && (
                      <div className={styles.eventDetailsDateTextIcons}>
                        <BsFillCalendarCheckFill />
                        <span className={styles.eventDetailsDateText}>
                          <span className={styles.eventDetailsDateTitle}>
                            Full Day:
                          </span>{" "}
                          <span className={styles.eventDetailsDateTextAns}>
                            {" "}
                            {eventData.eventDate.fullday}
                            {eventData.eventTime && " [ "+eventData.eventTime.fullday+" ]"}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.eventDetailsPrelimsFinals}>
                    {eventData.eventDate && eventData.eventDate.finals && (
                      <div className={styles.eventDetailsDateTextIcons}>
                        <BsFillCalendarCheckFill />
                        <span className={styles.eventDetailsDateText}>
                          <span className={styles.eventDetailsDateTitle}>
                            Finals:
                          </span>{" "}
                          <span className={styles.eventDetailsDateTextAns}>
                            {" "}
                            {eventData.eventDate.finals}
                            {eventData.eventTime && " [ "+eventData.eventTime.finals+" ]"}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.eventDetailsPrelimsFinals}>
                    {eventData.eventCoordinators && (
                      <div className={styles.eventDetailsDateTextIcons}>
                        {
                          <span className={styles.eventDetailsCallTitle}>
                            {eventData.eventCoordinators && eventData.eventCoordinators.map((eventCoordinator, id)=>{
                              return (
                                <span className={styles.eventCoordinators} key={id}>
                                  <IoCall className={styles.eventCoordinatorCall}/>{eventCoordinator}</span>
                              )
                            })}
                          </span>
                        }
                      </div>
                    )}
                  </div>
                  <div className={styles.eventDetailsPrelimsFinals}>
                    {eventData.eventVenue && (
                      <div className={styles.eventDetailsDateTextIcons}>
                        <MdPlace />
                        {
                          <span className={styles.eventDetailsCallTitle}>
                            {eventData.eventVenue}
                          </span>
                        }
                      </div>
                    )}
                  </div>
                </div>

                {authCtx.isAuthenticated && <div className={styles.eventEndRightButtonBox}>
                  <button
                    className={ "interestedRegisteredButton" }
                      // userInterested
                      //   ? "interestedButton"
                      //   : "interestedRegisteredButton"
                    // }
                    onClick={makeUserInterested}
                  >
                    {userInterested ? "Remove from watchlist" : "Add to Watchlist"}
                  </button>
                  <button className={!isRegistered? "interestedRegisteredButton": "interestedButton"} onClick={toggleVisibleRegistrationForm} disabled={isRegistered}>
                    {isRegistered? "Registered": "Register"}
                  </button>
                </div>}
                {!authCtx.isAuthenticated && <div className={styles.eventEndRightButtonBox}>
                <button
                    className={ "interestedRegisteredButton" }
                    onClick={goToLoginPage}
                  >Sign in to Register</button>
                  </div>}
              </div>
            </div>
          </div>
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
