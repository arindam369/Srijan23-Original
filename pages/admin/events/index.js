import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import styles from "../../../styles/Dashboard.module.css";
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
import EventDetailsBox from "@/components/Dashboard/EventDetailsBox";
import Link from "next/link";

function ViewEventsPage() {
  const authCtx = useContext(AuthContext);

  useEffect(()=>{
    authCtx.stopLoading();
  }, [])

  const [eventsArray, setEventsArray] = useState(null);

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
      
      <div className={styles.dashboardPageContainer}>
        <div className={styles.dashboardSectionHeading2}>
          Events Database
        </div>

        <div className={styles.eventDetailsContainer}>
            {events && events.length>0 && events.map((event)=>{
              console.log(event);
                return (
                    <Link className={styles.eventBoxTitle} key={event.eventId} href={`/admin/events/${event.eventId}`}>
                      {event.eventName}
                    </Link>
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