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
import AdminProtectedRoute from "@/hoc/AdminProtectedRoute";
import { events } from "@/helper/events";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import EventDetailsBox from "@/components/Dashboard/EventDetailsBox";

function ViewEventsPage() {
  const authCtx = useContext(AuthContext);

  useEffect(()=>{
    authCtx.stopLoading();
  }, [])

  const [eventsArray, setEventsArray] = useState(null);

    useEffect(()=>{
        onValue(ref_database(database, 'srijan/events') , (snapshot)=>{
            if(snapshot){
                let eventsArray = [];
                const eventDetailsArray = snapshot.val();
                for(let event in eventDetailsArray){
                    eventsArray.push({...eventDetailsArray[event], eventId: event});
                }
                setEventsArray(eventsArray);
            }
        }, {
            onlyOnce: true
        });
    }, [])

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
          Events Database
        </div>

        <div className={styles.userDetailsContainer}>
            {eventsArray && eventsArray.length>0 && eventsArray.map((event)=>{
                console.log(event);
                return (
                    <EventDetailsBox eventName={event.name} eventId={event.eventId} key={event.eventId}/>
                )
            })}
            {eventsArray && eventsArray.length === 0 && 
                    <div className={styles.noEventsFound}>No Event Found</div>
            }
        </div>
      </div>
    </>
  );
}

export default AdminProtectedRoute(ViewEventsPage);