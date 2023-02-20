import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { FaBookOpen, FaUserSecret, FaGamepad, FaRobot } from "react-icons/fa";
import { MdOutlineEmail, MdQuiz } from "react-icons/md";
import { ImMobile, ImImage } from "react-icons/im";
import { IoBusinessSharp } from "react-icons/io5";
import { HiCode, HiDotsCircleHorizontal } from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import { BsFillCalendarEventFill, BsPeopleFill } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import { GiBrain } from "react-icons/gi";
import { useContext } from "react";
import AuthContext from "@/store/AuthContext";
import { useEffect } from "react";
import { useState } from "react";

export default function AddEventPage() {
  const authCtx = useContext(AuthContext);

  useEffect(()=>{
    authCtx.stopLoading();
  }, [])

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [minMembers, setMinMembers] = useState("");
  const [eventRules, setEventRules] = useState("");
  const [eventCoordinators, setEventCoordinators] = useState("");
  const [eventPosterUrl, setEventPosterUrl] = useState("");
  const [isTest, setIsTest] = useState(false);
  const [eventType, setEventType] = useState("Robotics");
  const [error, setError] = useState(null);

  const handleMerchandiseBook = async (e)=>{
    e.preventDefault();
    authCtx.startLoading();

    // handle all validations
    if(eventName.trim().length === 0 || eventDescription.trim().length === 0 || maxMembers.trim().length === 0 || minMembers.trim().length === 0 || eventRules.trim().length === 0 || eventCoordinators.trim().length === 0 || eventPosterUrl.trim().length === 0 || isTest.trim().length === 0 || eventType.trim().length === 0){
      setError("All fields are mandatory");
      authCtx.stopLoading();
      return;
    }
    setError(null);
    
    // store data in firebase
    // await bookMerchandise(fullname, email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod);
    // setFullname("");
    // setEmail("");
    // setPhone("");
    // setCollege("");
    // setDept("");
    // setTshirtName("");
    // setTshirtColor("Black");
    // setTshirtSize("L");
    // setPaymentMethod("Cash");
    authCtx.stopLoading();

  }

  return (
    <>
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
      
      <div className={styles.merchandiseContainer}>
        <div className={styles.merchandiseHeading}>
          Srijan'23 Event Creation
        </div>

        <div className={styles.merchandiseBody}>
          <div className={styles.merchandiseForm} id="merchandiseForm">
            <form onSubmit={handleMerchandiseBook}>
                  {error && <div className={styles.errorBox2}>
                    {error}
                  </div>}
              <div className={styles.registerInputBox}>
                
                <div className={styles.registerInput}>
                <label htmlFor="eventName" className={styles.registerInputLabel}>Event Name</label>
                  <input type="text" placeholder="Enter name of the event" id="eventName" value={eventName} onChange={(e)=>{setEventName(e.target.value)}}/>
                  <BsFillCalendarEventFill className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput3}>
                    <label htmlFor="eventDescription" className={styles.registerInputLabel}>Event Description</label>
                  <textarea type="text" placeholder="Write something about the event" id="eventDescription" rows={12} cols={20} value={eventDescription} onChange={(e)=>{setEventDescription(e.target.value)}}/>
                  <AiFillInfoCircle className={styles.registerIcon} />
                </div>
              </div>

              <div className={styles.registerInputBox2}>
                <div className={styles.registerHalfInput}>
                    <label htmlFor="maxMembers" className={styles.registerInputLabel}>Max Members</label>
                  <input type="number" placeholder="Max members" id="mobile" value={maxMembers} onChange={(e)=>{setMaxMembers(e.target.value)}}/>
                  <BsPeopleFill className={styles.registerIcon} />
                </div>
                <div className={styles.registerHalfInput}>
                    <label htmlFor="minMembers" className={styles.registerInputLabel}>Min Members</label>
                  <input type="number" placeholder="Min members" id="minMembers" value={minMembers} onChange={(e)=>{setMinMembers(e.target.value)}}/>
                  <BsPeopleFill className={styles.registerIcon} />
                </div>
              </div>

              <div className={styles.registerInputBox}>
                <div className={styles.registerInput3}>
                <label htmlFor="eventRules" className={styles.registerInputLabel}>Event Rules</label>
                  <textarea type="text" placeholder="Point out the rules of the event" id="eventRules" value={eventRules} rows={12} cols={20} onChange={(e)=>{setEventRules(e.target.value)}}/>
                  <FaBookOpen className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                <label htmlFor="eventCoordinators" className={styles.registerInputLabel}>Event Coordinators</label>
                  <input type="text" placeholder="Who are going to be the coordinators for this event?" id="eventCoordinators" value={eventCoordinators} onChange={(e)=>{setEventCoordinators(e.target.value)}}/>
                  <FaUserSecret className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                <label htmlFor="eventPoster" className={styles.registerInputLabel}>Event Poster</label>
                  <input
                    type="text"
                    placeholder="Upload a poster for your event"
                    id="eventPoster"
                    value={eventPosterUrl} onChange={(e)=>{setEventPosterUrl(e.target.value)}}
                  />
                  <ImImage className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                <label htmlFor="isTest" className={styles.registerInputLabel}>Is it any type of Test?</label>
                  <select id="isTest" value={isTest} onChange={(e)=>{setIsTest(e.target.value)}}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <MdQuiz className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="eventType" className={styles.registerInputLabel}>Event Type</label>
                    <select id="eventType" value={eventType} onChange={(e)=>{setEventType(e.target.value)}}>
                        <option value="Coding">Coding</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Business">Business & Management</option>
                        <option value="Brainstorming">Brainstorming</option>
                        <option value="Misc">Misc</option>
                    </select>
                  {eventType==="Coding" && <HiCode className={styles.registerIcon} />}
                  {eventType==="Gaming" && <FaGamepad className={styles.registerIcon} />}
                  {eventType==="Robotics" && <FaRobot className={styles.registerIcon} />}
                  {eventType==="Business" && <IoBusinessSharp className={styles.registerIcon} />}
                  {eventType==="Brainstorming" && <GiBrain className={styles.registerIcon} />}
                  {eventType==="Misc" && <HiDotsCircleHorizontal className={styles.registerIcon} />}
                </div>
              </div>
              <div className={styles.centerBox}>
              <button className={styles.registerButton}>Create Event</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
