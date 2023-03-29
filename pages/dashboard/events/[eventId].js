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
import {
  makeEventInterested,
  makeEventUnInterested,
} from "@/helper/login-utils";
import { useContext } from "react";
import AuthContext from "@/store/AuthContext";
import { useEffect } from "react";
import { notification } from "antd";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { SiWhatsapp } from "react-icons/si";

export default function EventDetailsPage({ eventData }) {
  // console.log(eventData);

  if (!eventData) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.eventDetailsContainer}>
          <h2 className={styles.noEventsFound}>No Event Found</h2>;
        </div>
      </div>
    )
  }
  const [userInterested, setUserInterested] = useState(false);
  const [visibleRegistrationModal, setVisibleRegistrationModal] =
    useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    authCtx.stopLoading();
  }, []);

  const makeUserInterested = () => {
    if (authCtx.userId) {
      if (!userInterested) {
        setUserInterested(true);
        const userId = authCtx.userId;
        makeEventInterested(userId, eventData.eventId, eventData.eventName);
        setTimeout(() => {
          authCtx.refetchInterestedEvents();
        }, 5000);
        notification["success"]({
          message: `Event added to Watchlist`,
          duration: 2,
        });
      } else {
        setUserInterested(false);
        const userId = authCtx.userId;
        makeEventUnInterested(userId, eventData.eventId, eventData.eventName);
        setTimeout(() => {
          authCtx.refetchInterestedEvents();
        }, 5000);
        notification["success"]({
          message: `Event removed from Watchlist`,
          duration: 2,
        });
      }
    }
  };

  const toggleVisibleRegistrationForm = () => {
    setVisibleRegistrationModal(!visibleRegistrationModal);
  };
  const customEventModalStyles = {
    overlay: {
      background: "rgba(0,0,0,0.65)",
      zIndex: "100",
    },
  };

  useEffect(() => {
    authCtx.interestedEvents &&
      authCtx.interestedEvents.find((event) => {
        if (event && event.eventId === eventData.eventId) {
          setUserInterested(true);
        }
      });
  }, [authCtx.interestedEvents]);

  useEffect(() => {
    onValue(
      ref_database(
        database,
        "srijan/profiles/" + authCtx.userId + "/events/" + eventData.eventId
      ),
      (snapshot) => {
        // console.log(snapshot && snapshot.val());
        if (snapshot) {
          if (snapshot.val() !== null) {
            setIsRegistered(true);
          }
        }
      },
      {
        onlyOnce: true,
      }
    );
  }, []);

  const handleRegisterEvent = () => {
    setIsRegistered(true);
  };
  const router = useRouter();
  const goToLoginPage = () => {
    router.push("/register");
  };

  const handleWhatsappShare = () => {
    const textArray = [
      `   _Hey, you! Yes, you! Want to join me in an adventure of a lifetime? Well, maybe not a lifetime, but definitely a fun time! I'm going to this super cool event: *${eventData.eventName}*, and I need someone awesome to come with me. You fit the bill! We'll have a blast, promise. So, what do you say? Are you in? Let's do this!_%0a   _Cast a look upon this event here: https://www.srijanju.in/dashboard/events/${eventData.eventId}_`,
      `   _Hey, you! Yes, you! I have a proposition for you that I think you'll like. How about you ditch whatever you're doing on the day, and come hang out with me at this awesome event: *${eventData.eventName}*? Trust me, it's going to be so much fun, and you'll regret it if you miss out. Plus, I could really use your company because I can't handle all the fun on my own. Let me know if you're down, and we'll make it happen!_%0a   _Event Link: https://www.srijanju.in/dashboard/events/${eventData.eventId}_`,
      `   _Hey beautiful! There's this amazing event: *${eventData.eventName}* happening, and I would be absolutely thrilled if you would join me. I know we'll have an amazing time together. I can't wait to spend some quality time with you and create unforgettable memories. So, what do you say? Will you be my plus one?_%0a   _Event Link: https://www.srijanju.in/dashboard/events/${eventData.eventId}_`,
      `   _Are you tired of working with a bunch of boring folks who take themselves way too seriously? Do you long for a team that knows how to have fun while still getting stuff done?_%0a   _Well, you're in luck! Our team is seeking a new member for the event: *${eventData.eventName}* and we're pretty sure you're the peanut butter to our jelly. (Or the hummus to our pita chips, if you're more of a savory person.)_%0a   _Cast a look upon this event here: https://www.srijanju.in/dashboard/events/${eventData.eventId}_`,
      `   _Hey! Are you a fan of cheese? Because we've got a team that's as cheesy as they come, and we're looking for one more to join this. And who knows, maybe we'll even come away with the big prize and have the whole world marveling at our cheesy talents. So if you're ready to join a team for the event: *${eventData.eventName}* that's as cheesy as they come, then let us know. We can't wait to add another member to enjoy this so much cheesy event!_%0a   _Have a look upon this event here: https://www.srijanju.in/dashboard/events/${eventData.eventId}_`
    ];

    const text = textArray[Math.floor(Math.random() * textArray.length)];
    const wpUrl = `whatsapp://send?text=${text}`;
    window.open(wpUrl);
  };

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
        <link rel="manifest" href="/../../manifest.json" />
        <title>SRIJAN'23 | Jadavpur University</title>

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
        <link rel="shortcut icon" href="favicon2.ico" type="image/x-icon" />
        <link rel="icon" type="image/x-icon" href="favicon2.ico" />
      </Head>
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
        <EventRegistration
          eventName={eventData.eventName}
          eventId={eventData.eventId}
          minMembers={eventData.minMembers}
          maxMembers={eventData.maxMembers}
          toggleVisibleRegistrationForm={toggleVisibleRegistrationForm}
          onRegister={handleRegisterEvent}
        />
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
                  {eventData.eventDescription &&
                    eventData.eventDescription.map((eventDescLine, idx) => {
                      return <p key={idx}>&emsp;{eventDescLine}</p>;
                    })}
                </div>
              </div>

              <div className={styles.eventDetailsMidbox}>
                <div className={styles.eventDetailsLeft}>
                  {/* <div className={styles.eventPosterCollection}>
                    <EventPosters />
                  </div> */}
                  <Image
                    src={eventData.eventPoster}
                    height={350}
                    width={500}
                    alt="eventPosterImage"
                    className={styles.eventPosterImage}
                    draggable={false}
                  />
                </div>

                <div className={styles.eventDetailsRight}>
                  <div className={styles.eventDetailsHalfSection}>
                    <div className={styles.eventDetailsSectionHeading}>
                      <FaBookOpen className={styles.eventDetailsIcon} />
                      <div>Rules & Guidelines</div>
                    </div>

                    <div className={styles.eventDetailsSectionText}>
                      {eventData.eventRules &&
                        eventData.eventRules.map((eventRule, idx) => {
                          return (
                            <li key={idx}>
                              <FaRegDotCircle
                                className={styles.eventDetailsBulletIcon}
                              />
                              <div>{eventRule}</div>
                            </li>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              {eventData.eventRuleLink && (
                <div className={styles.eventFullDescription}>
                  Wanna know more about this event?{" "}
                  <Link
                    href={eventData.eventRuleLink}
                    className={styles.eventDescLink}
                  >
                    Click Here
                  </Link>
                </div>
              )}

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
                            {eventData.eventTime &&
                              " [ " + eventData.eventTime.prelims[0] + " ]"}
                          </span>
                        </span>
                      </div>
                    ) : (
                      eventData.eventDate && eventData.eventDate.prelims &&
                      eventData.eventDate.prelims.map(
                        (prelimsDate, prelimsId) => {
                          return (
                            <div
                              className={styles.eventDetailsDateTextIcons}
                              key={prelimsId}
                            >
                              <BsFillCalendarCheckFill />
                              <span className={styles.eventDetailsDateText}>
                                <span className={styles.eventDetailsDateTitle}>
                                  Prelims{prelimsId + 1}:
                                </span>{" "}
                                <span
                                  className={styles.eventDetailsDateTextAns}
                                >
                                  {prelimsDate}
                                  {eventData.eventTime &&
                                    " [ " +
                                      eventData.eventTime.prelims[prelimsId] +
                                      " ]"}
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
                            {eventData.eventTime &&
                              " [ " + eventData.eventTime.fullday + " ]"}
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
                            {eventData.eventTime &&
                              " [ " + eventData.eventTime.finals + " ]"}
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
                            {eventData.eventCoordinators &&
                              eventData.eventCoordinators.map(
                                (eventCoordinator, id) => {
                                  return (
                                    <span
                                      className={styles.eventCoordinators}
                                      key={id}
                                    >
                                      <IoCall
                                        className={styles.eventCoordinatorCall}
                                      />
                                      {eventCoordinator}
                                    </span>
                                  );
                                }
                              )}
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

                <div className={styles.eventEndRightButtonBox}>
                  <SiWhatsapp
                    className={"whatsappButton"}
                    onClick={handleWhatsappShare}
                  />
                  {authCtx.isAuthenticated && (
                    <button
                      className={"interestedRegisteredButton"}
                      onClick={makeUserInterested}
                    >
                      {userInterested
                        ? "Remove from watchlist"
                        : "Add to Watchlist"}
                    </button>
                  )}

                  {authCtx.isAuthenticated && (
                    <button
                      className={
                        !isRegistered
                          ? "interestedRegisteredButton"
                          : "interestedButton"
                      }
                      onClick={toggleVisibleRegistrationForm}
                      disabled={isRegistered}
                    >
                      {isRegistered ? "Registered" : "Register"}
                    </button>
                  )}
                  {!authCtx.isAuthenticated && (
                    <div className={styles.eventEndRightButtonBox}>
                      <button
                        className={"interestedRegisteredButton"}
                        onClick={goToLoginPage}
                      >
                        Sign in to Register
                      </button>
                    </div>
                  )}
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
