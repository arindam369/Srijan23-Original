import { Canvas } from "@react-three/fiber"
import {OrbitControls, Stars} from "@react-three/drei";
import AuthContext from "@/store/AuthContext";
import { useContext, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import {ImProfile} from "react-icons/im";
import {BsCalendar3} from "react-icons/bs";
import {MdFavorite} from "react-icons/md";
import {FiSettings, FiSave, FiLogOut} from "react-icons/fi";
import {IoNotifications} from "react-icons/io5";
import Profile from "@/components/Dashboard/Profile";
import Sponsors from "@/components/Dashboard/Sponsors";
import Talks from "@/components/Dashboard/Talks";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useEffect } from "react";
import Events from "@/components/Dashboard/Events";
import Watchlist from "@/components/Dashboard/Watchlist";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import Notification from "@/components/Dashboard/Notification";
import Head from "next/head";


function DashboardPage(){
    const authCtx = useContext(AuthContext);

    useEffect(()=>{
        authCtx.stopLoading();
    }, [])

    const [visibleDashboard, setVisibleDashboard] = useState(false);
    const [visibleEvents, setVisibleEvents] = useState(false);
    const [visibleWatchlist, setVisibleWatchlist] = useState(false);
    const [visibleTalks, setVisibleTalks] = useState(false);
    const [visibleSponsors, setVisibleSponsors] = useState(false);
    const [visibleProfile, setVisibleProfile] = useState(false);
    const [visibleNotification, setVisibleNotification] = useState(false);

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const controlNavbar = (e)=>{
        if(e.currentTarget.scrollTop > lastScrollY){
            setShowNavbar(false);
        }
        else{
            setShowNavbar(true);
        }
        setLastScrollY(e.currentTarget.scrollTop);
    }

    const showDashboard = ()=>{
        setVisibleDashboard(true);
        setVisibleEvents(false);
        setVisibleWatchlist(false);
        setVisibleTalks(false);
        setVisibleSponsors(false);
        setVisibleProfile(false);
        setVisibleNotification(false);
    }
    const showEvents = ()=>{
        setVisibleDashboard(false);
        setVisibleEvents(true);
        setVisibleWatchlist(false);
        setVisibleTalks(false);
        setVisibleSponsors(false);
        setVisibleProfile(false);
        setVisibleNotification(false);
    }
    const showWatchlist = ()=>{
        setVisibleDashboard(false);
        setVisibleEvents(false);
        setVisibleWatchlist(true);
        setVisibleTalks(false);
        setVisibleSponsors(false);
        setVisibleProfile(false);
        setVisibleNotification(false);
    }
    const showTalks = ()=>{
        setVisibleDashboard(false);
        setVisibleEvents(false);
        setVisibleWatchlist(false);
        setVisibleTalks(true);
        setVisibleSponsors(false);
        setVisibleProfile(false);
        setVisibleNotification(false);
    }
    const showSponsors = ()=>{
        setVisibleDashboard(false);
        setVisibleEvents(false);
        setVisibleWatchlist(false);
        setVisibleTalks(false);
        setVisibleSponsors(true);
        setVisibleProfile(false);
        setVisibleNotification(false);
    }
    const showProfile = ()=>{
        setVisibleDashboard(false);
        setVisibleEvents(false);
        setVisibleWatchlist(false);
        setVisibleTalks(false);
        setVisibleSponsors(false);
        setVisibleProfile(true);
        setVisibleNotification(false);
    }
    const showNotification = ()=>{
        setVisibleDashboard(false);
        setVisibleEvents(false);
        setVisibleWatchlist(false);
        setVisibleTalks(false);
        setVisibleSponsors(false);
        setVisibleProfile(false);
        setVisibleNotification(true);
    }
    
    useEffect(()=>{
        showDashboard();
    }, [])


    const userData = authCtx.userData;
    return (
        <>
            <Head>
                <link rel="manifest" href="manifest.json" />
            </Head>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <Stars/>
                    {/* <Plane/> */}
                    <OrbitControls
                        enableZoom={false}
                        rotateSpeed={0.4}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                    />
                    <ambientLight intensity={1.5}/>
                    <spotLight position={[10, 15, 10]} angle={0.3} />
                </Canvas>
            </div>

            <div className={styles.dashboardContainer} id="dashboardContainer" onScroll={controlNavbar}>
                <div className={styles.dashboardSidebar}>
                    <li className={visibleDashboard? "dashboardList activeDashboardList" : "dashboardList"} onClick={showDashboard}>
                        <ImProfile className={styles.dashboardIcon}/>
                        <div>Dashboard</div>
                    </li>
                    <li className={visibleEvents? "dashboardList activeDashboardList" : "dashboardList"} onClick={showEvents}>
                        <BsCalendar3 className={styles.dashboardIcon}/>
                        <div>Events</div>
                    </li>
                    <li className={visibleWatchlist? "dashboardList activeDashboardList" : "dashboardList"} onClick={showWatchlist}>
                        <MdFavorite className={styles.dashboardIcon}/>
                        <div>Watchlist</div>
                    </li>
                    {/* <li className={visibleTalks? "dashboardList activeDashboardList" : "dashboardList"} onClick={showTalks}>
                        <HiMicrophone className={styles.dashboardIcon}/>
                        <div>Talks</div>
                    </li> */}
                    {/* <li className={visibleSponsors? "dashboardList activeDashboardList" : "dashboardList"} onClick={showSponsors}>
                        <FaDonate className={styles.dashboardIcon}/>
                        <div>Sponsors</div>
                    </li> */}
                    <li className={visibleProfile? "dashboardList activeDashboardList" : "dashboardList"} onClick={showProfile}>
                        <FiSettings className={styles.dashboardIcon}/>
                        <div>Profile</div>
                    </li>
                </div>

                {/* I have to do it for mobile responsive ----------------------- */}
                <div className={showNavbar?"mobileDashboardSidebar":"mobileDashboardSidebar hiddenDashboardSidebar"}>
                    <li className={visibleDashboard? "mobileDashboardList activeMobileDashboardList" : "mobileDashboardList"} onClick={showDashboard}>
                        <ImProfile className={"mobileDashboardIcon"}/>
                        <div className="mobileDashboardNavTitle">Dashboard</div>
                    </li>
                    <li className={visibleEvents? "mobileDashboardList activeMobileDashboardList": "mobileDashboardList"} onClick={showEvents}>
                        <BsCalendar3 className={"mobileDashboardIcon"}/>
                        <div className="mobileDashboardNavTitle">Events</div>
                    </li>
                    <li className={visibleWatchlist? "mobileDashboardList activeMobileDashboardList" : "mobileDashboardList"} onClick={showWatchlist}>
                        <MdFavorite className={"mobileDashboardIcon"}/>
                        <div className="mobileDashboardNavTitle">Watchlist</div>
                    </li>
                    {/* <li className={visibleTalks? "mobileDashboardList activeMobileDashboardList" : "mobileDashboardList"} onClick={showTalks}>
                        <HiMicrophone className={"mobileDashboardIcon"}/>
                        <div className="mobileDashboardNavTitle">Talks</div>
                    </li> */}
                    {/* <li className={visibleSponsors? "mobileDashboardList activeMobileDashboardList" : "mobileDashboardList"} onClick={showSponsors}>
                        <FaDonate className={"mobileDashboardIcon"}/>
                        <div className="mobileDashboardNavTitle">Sponsors</div>
                    </li> */}
                    <li className={visibleProfile? "mobileDashboardList activeMobileDashboardList" : "mobileDashboardList"} onClick={showProfile}>
                        <FiSettings className={"mobileDashboardIcon"}/>
                        <div className="mobileDashboardNavTitle">Profile</div>
                    </li>
                </div>



                <div className={styles.dashboardBody}>
                    <div className={visibleNotification? "notificationBox activeNotificationBox":"notificationBox"} onClick={()=>{showNotification()}}>
                        <IoNotifications/>
                    </div>
                    <div className={styles.logoutBox} onClick={()=>{authCtx.logout()}}>
                        <FiLogOut/>
                        <span>{authCtx && authCtx.userId && authCtx.userId.length>20?authCtx.userId.slice(0, 17)+"..." : authCtx.userId}</span>
                    </div>
                    {/* <div className={styles.dashboardHeading}>Dashboard</div> */}
                    {/* {userData && <div>
                        <div className={styles.dashboardHeading}>{userData.name}</div>
                        <div className={styles.dashboardHeading}>{userData.email}</div>
                        <div className={styles.dashboardHeading}>{userData.college}</div>
                        <div className={styles.dashboardHeading}>{userData.dept}</div>
                        <div className={styles.dashboardHeading}>{userData.year}</div>
                    </div>} */}
                    {visibleDashboard && <Dashboard/>}
                    {visibleEvents && <Events/>}
                    {visibleWatchlist && <Watchlist/>}
                    {visibleTalks && <Talks/>}
                    {visibleSponsors && <Sponsors/>}
                    {visibleProfile && <Profile/>}
                    {visibleNotification && <Notification/>}
                    
                </div>

            </div>
        </>
    )
}

export default ProtectedRoute(DashboardPage);