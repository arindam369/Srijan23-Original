import { Canvas } from "@react-three/fiber";
import {OrbitControls, Stars} from "@react-three/drei";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { gsap } from "gsap";
import { useState, useEffect, useRef, useContext } from "react";
import Register from "@/components/Register/Register";
import Login from "@/components/Register/Login";
import { useRouter } from "next/router";
import AuthContext from "@/store/AuthContext";
import {FcGoogle} from "react-icons/fc";
import Countdown from "../Countdown";

// function Plane(){
//     return (
//       <mesh position={[0,0,0]} rotation={[-Math.PI/2,0,0]}>
//         <planeBufferGeometry attach="geometry" args={[100, 100]} height="200" width="400" widthSegments="80"/>
//         <meshLambertMaterial attach="material" color="lightblue"/>
//       </mesh>
//     )
// }

export default function RegisterPage2(){

    const [visibleRegister, setVisibleRegister] = useState(false);
    const [visibleLogin, setVisibleLogin] = useState(false);

    const authCtx = useContext(AuthContext);
    const router = useRouter();

    function toggleRegister(){
        if(visibleRegister){
            setVisibleRegister(false);

        }
        else{
            setVisibleLogin(false);
            setVisibleRegister(true);
        }
    }
    function toggleLogin(){
        if(visibleLogin){
            setVisibleLogin(false);

        }
        else{
            setVisibleRegister(false);
            setVisibleLogin(true);
        }
    }

    function goToMerchandise(){
        authCtx.startLoading();
        router.push("/merchandise");
    }
    function goToDashboard(){
        authCtx.startLoading();
        router.push("/dashboard");
    }

    const homeHeadingRef = useRef();
    const srijanLogoRef = useRef();

    useEffect(()=>{
        const tl = gsap.timeline();
        tl.fromTo(homeHeadingRef.current,{x:30, opacity:0}, {x:0, opacity: 1, stagger: 0.1, ease:"expo", duration: 1, delay:0.2});
        tl.fromTo(srijanLogoRef.current, {y:-130, opacity:0}, {y:0, opacity: 1, stagger: 0.1, ease:"bounce", duration: 1, delay: 0.2});
    },[])


    function handleLogout(){
        authCtx.logout();
    }
    function signInUsingGoogle(){
        authCtx.googleSignIn();
    }
    function handleTeam(){
        router.push("/team");
    }

    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <Stars/>
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


            <div className={styles.homeBody2} id="homeContainer">
                {!visibleRegister && !visibleLogin && <div className={styles.homeBox1}>
                    <div className={styles.homeHeading} id="homeHeading" ref={homeHeadingRef}>
                        <Image src={"/assets/JU-white.png"} height={55} width={55} alt="ju_logo" draggable="false" className={styles.juLogo}/>
                        {!visibleRegister && !visibleLogin && <Image src={"/assets/Annual_white.png"} height={160} width={440} alt="srijan_logo" draggable="false" id="srijanLogo" className={styles.technoFestLogo}/>}
                        <Image src={"/assets/Jadavpur-white.png"} height={25} width={290} alt="ju_logo" draggable="false"/>
                    </div>
                </div>}
                {!visibleRegister && !visibleLogin && <div className={styles.homeBox4}>
                    <Image src={"/assets/Annual_white.png"} height={160} width={440} alt="srijan_logo" draggable="false" id="srijanLogo" className={styles.technoFestLogo}/>
                    <div className={styles.homeHeading} id="homeHeading" ref={homeHeadingRef}>
                        <Image src={"/assets/JU-white.png"} height={55} width={55} alt="ju_logo" draggable="false" className={styles.juLogo}/>
                        <Image src={"/assets/Jadavpur-white.png"} height={25} width={290} alt="ju_logo" 
                        className={styles.juHeadline} draggable="false"/>
                    </div>
                </div>}

                {!visibleRegister && !visibleLogin && <div className={styles.homeBox2}>

                    <Image src={"/assets/FETSU-white.png"} height={160} width={440} alt="srijan_logo" draggable="false" id="fetsuLogo" className={styles.fetsuLogo}/>
                    
                    <div className={styles.srijanIconBox}>
                        <Image src={"/assets/Srijan-c-white.png"} height={160} width={440} alt="srijan_icon_logo" draggable="false"  className={styles.srijanIconLogo} ref={srijanLogoRef}/>
                        <Image src={"/assets/SRIJAN-white.png"} height={160} width={440} alt="srijan_logo" draggable="false" id="srijanLogo" className={styles.srijanLogo} ref={srijanLogoRef}/>
                    </div>
                    <div className={styles.datesHeading}>
                        13th - 16th April
                    </div>

                    <h4 className={styles.liveHeading}>is ENDED</h4>

                    {/* {!visibleRegister && !visibleLogin && <Countdown/>} */}
                </div>}

                
                {/* Uncomment these portion before srijan ----------------------- */}
                {!visibleRegister && !visibleLogin &&
                <div className={styles.loginRegisterBox}>
                    <div className={styles.merchandiseButton} onClick={goToMerchandise}>Srijan'23 Merchandise</div>
                </div>}
                {!authCtx.isAuthenticated && !visibleRegister && !visibleLogin &&
                <div className={styles.loginRegisterBox}>
                    <div className={styles.loginRegisterButton} onClick={toggleRegister}>Register</div>
                    <div className={styles.loginRegisterButton} onClick={toggleLogin}>Login</div>
                </div>}

                {!authCtx.isAuthenticated && visibleRegister && <Register onLogin={toggleLogin} onCancel={toggleRegister}/>}
                {!authCtx.isAuthenticated && visibleLogin && <Login onRegister={toggleRegister} onCancel={toggleLogin}/>}


                {authCtx.isAuthenticated && <div className={styles.dashboardButton} onClick={goToDashboard}>Go to Dashboard</div>}
                {authCtx.isAuthenticated && <div className={styles.dashboardButton} onClick={handleLogout}>Logout</div>}
                {!authCtx.isAuthenticated && !visibleRegister && !visibleLogin && <div className={styles.loginRegisterBox}>
                    <button className={styles.googleButton} onClick={signInUsingGoogle}>
                        <FcGoogle className={styles.googleIcon}/>
                        <span>Sign in with Google</span>
                    </button>
                </div>}
                {/* <div className={styles.dashboardButton} onClick={handleTeam}>Our Team</div> */}
            </div>
        </>
    );
}