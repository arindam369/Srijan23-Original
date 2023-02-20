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

export default function EventDetailsPage({ eventData }) {
  // console.log(eventData);

  if(!eventData){
    return <h2>No Event Found</h2>;
  }

  const [userInterested, setUserInterested] = useState(false);
  const [visibleRegistrationModal, setVisibleRegistrationModal] = useState(false);

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
      if(event.eventId === eventData.eventId){
        setUserInterested(true);
      }
    })
  }, [authCtx.interestedEvents])

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
        <EventRegistration eventName={eventData.eventName} eventId={eventData.eventId} minMembers={1} maxMembers={5}/>
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
                  &emsp; What if Doge turned up in your campus next week?
                  Trollface laughed at your midsem marks, or Fancy Winnie the
                  Pooh lent you his tuxedo? Better still, what if you and the
                  bois could make history, this Srijan '20?
                  <br />
                  <br />
                  As entertainment goes through another paradigm shift, this
                  decade, mark yourself safe from online oblivion, with
                  'Mementos'- our very own meme generating event. Tickle the
                  world's humerus and become an overnight sensation! #Srijan_20
                  #tech_enthusiasts_assemble
                </div>
              </div>

              <div className={styles.eventDetailsMidbox}>
                <div className={styles.eventDetailsLeft}>
                  <div className={styles.eventPosterCollection}>
                    <EventPosters />
                  </div>
                </div>

                <div className={styles.eventDetailsRight}>
                  <div className={styles.eventDetailsHalfSection}>
                    <div className={styles.eventDetailsSectionHeading}>
                      <HiUserGroup className={styles.eventDetailsIcon} />
                      <div>Participation</div>
                    </div>

                    <div className={styles.eventDetailsSectionText}>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>Participation is free for all.</div>
                      </li>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          Send in your memes on the submission page. LINK will
                          be live from 16-FEB-2020 midnight on the Facebook
                          Pages
                        </div>
                      </li>

                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          The submissions will be accepted as per the rules.
                        </div>
                      </li>
                    </div>
                  </div>
                  <div className={styles.eventDetailsHalfSection}>
                    <div className={styles.eventDetailsSectionHeading}>
                      <FaBookOpen className={styles.eventDetailsIcon} />
                      <div>Rules & Guidelines</div>
                    </div>

                    <div className={styles.eventDetailsSectionText}>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          The participant must be registered on the SRIJAN
                          portal.
                        </div>
                      </li>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          The memes must not target a religious or political
                          party or promote any related propaganda.
                        </div>
                      </li>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          The memers can use any template available or create a
                          new template from themselves.
                        </div>
                      </li>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          In case a template is custom made with personal
                          contacts i.e. using your friends’ pictures or contains
                          you yourselves, a consent from all the persons in the
                          meme would be required to post the meme. (option will
                          be available on the link)
                        </div>
                      </li>
                      <li>
                        <FaRegDotCircle
                          className={styles.eventDetailsBulletIcon}
                        />
                        <div>
                          A participant can send in multiple entries upto 3
                          memes. Multiple entries must be made within a time
                          span of 24 hours from the first submission.
                        </div>
                      </li>
                    </div>
                  </div>
                </div>
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
                            {eventData.eventDate.prelims[0]} [{" "}
                            {eventData.eventTime.prelims[0]} ]
                          </span>
                        </span>
                      </div>
                    ) : (
                      eventData.eventDate.prelims &&
                      eventData.eventDate.prelims.map(
                        (prelimsDate, prelimsId) => {
                          return (
                            <div className={styles.eventDetailsDateTextIcons}>
                              <BsFillCalendarCheckFill />
                              <span className={styles.eventDetailsDateText}>
                                <span className={styles.eventDetailsDateTitle}>
                                  Prelims{prelimsId + 1}:
                                </span>{" "}
                                <span
                                  className={styles.eventDetailsDateTextAns}
                                >
                                  {prelimsDate} [{" "}
                                  {eventData.eventTime.prelims[prelimsId]} ]{" "}
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
                            {eventData.eventDate.fullday} [{" "}
                            {eventData.eventTime.fullday} ]
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
                            {eventData.eventDate.finals} [{" "}
                            {eventData.eventTime.finals} ]
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.eventDetailsPrelimsFinals}>
                    {eventData.eventCoordinators && (
                      <div className={styles.eventDetailsDateTextIcons}>
                        <IoCall />
                        {
                          <span className={styles.eventDetailsCallTitle}>
                            {eventData.eventCoordinators.join(", ")}
                          </span>
                        }
                      </div>
                    )}
                  </div>
                  <div className={styles.eventDetailsPrelimsFinals}>
                    {eventData.eventCoordinators && (
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

                <div className={styles.eventEndRightButtonBox}>
                  <button
                    className={ "interestedRegisteredButton" }
                      // userInterested
                      //   ? "interestedButton"
                      //   : "interestedRegisteredButton"
                    // }
                    onClick={makeUserInterested}
                  >
                    {userInterested ? "Added in watchlist" : "Add to Watchlist"}
                  </button>
                  <button className={"interestedRegisteredButton"} onClick={toggleVisibleRegistrationForm}>
                    Register
                  </button>
                </div>
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
