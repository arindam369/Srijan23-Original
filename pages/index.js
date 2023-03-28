import { Canvas } from "@react-three/fiber"
import {OrbitControls, Stars} from "@react-three/drei";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function HomePage(){

  const router = useRouter();
  useEffect(()=>{
    setTimeout(() => {
      router.push("/register");
    }, 5500);
  }, [])

  // const [visibleWarningButton, setVisibleWarningButton] = useState(false);

  // const data = "Jadavpur University has always been an epitome of excellence and the perfect example of a place meant for holistic development of an individual. Ever since 1955, JU has been leading the front, be it for technical expertise or cultural prowess. However, some time back in 2007, few individuals of the Faculty of Engineering and Technology at Jadavpur University grew restless thinking of how JU despite being an ocean of scientific mastery, was not contributing towards a platform for technical recreation. Every body could do classes, attend labs, have an 'adda' at the field, crack complex research problems, or make merry dancing to songs at a fest. But as a leading technical institution, how was JU enabling others to explore their technical selves through recreation? Thus, SRIJAN was conceived. :)";
  // const data2 = "Today, SRIJAN stands proudly as the biggest and most prestigious techno-management fest in the City of Joy. Being a part of SRIJAN is like working at a startup: there are no fixed methods of working, you do not know whether your experiments will succeed, everyone has to do all kinds of work, you have to be bonded strongly to your teammates, and the learning and exposure is immense! :)"
  // const data3 = "This time, Srijan is back with lots of events and everything is overloaded. So beware of this much enjoyment and then click 'Okay' to enter into the UNIVERSE of Srijan'23.";
  // const [homeText1, setHomeText1] = useState("");
  // const [homeText2, setHomeText2] = useState("");
  // const [homeText3, setHomeText3] = useState("");

  // useEffect(()=>{
  //   let index = 0;
  //   (function printDataSlowly() {

  //     const consoleTyper = setInterval(function () {
  //         if (index != data.length+1) {
  //             setHomeText1(data.substr(0, index));
  //             index++;
  //         }
  //         else
  //         {
  //           clearInterval(consoleTyper);
            
  //           let index2 = 0;
  //           const consoleTyper2 = setInterval(function () {
  //             if (index2 != data2.length+1) {
  //                 setHomeText2(data2.substr(0, index2));
  //                 index2++;
  //             }
  //             else
  //             {
  //               clearInterval(consoleTyper2);
                
  //               let index3=0;
  //               const consoleTyper3 = setInterval(function () {
  //                 if (index3 != data3.length+1) {
  //                     setHomeText3(data3.substr(0, index3));
  //                     index3++;
  //                 }
  //                 else
  //                 {
  //                   clearInterval(consoleTyper3);
  //                   setVisibleWarningButton(true);
  //                 }
  //             }, 90);
  //             }
  //         }, 30);
  //         }
  //     }, 20);
  //   })();
  // }, [])

  return <>
    <Head>
      <link rel="manifest" href="manifest.json" />
    </Head>
    <div className={styles.canvasBody} id="canvasContainer"></div>
    <div className={styles.homeBody} id="homeContainer">
      <div className={styles.frontHeading}>
        {/* <Image src={"/assets/ju_logo.svg"} height={55} width={55} alt="ju_logo"/>
        <h2 className={styles.homeHeadingText}>JADAVPUR UNIVERSITY</h2> */}
        {/* <h1 className={styles.frontHeadingText}>SpaceShip is ready to fly towards Srijan 23 . . .</h1> */}
      </div>
      
      {/* <h1 className={styles.frontHeadingText}>. . . wear your Seat Belts . . . </h1> */}

      {/* <h2 className={styles.frontHeadingText} style={{"margin-bottom": "100px"}}>Are you Ready ?</h2> */}
      {/* <Image src={"/assets/srijan_logo_white.png"} height={160} width={400} alt="srijan_logo"/> */}

        {/* <div className={styles.homeBox}> */}
          {/* <h2 className={styles.homeHead}>Srijan'23</h2> */}
          {/* <p className={styles.homeParagraphs}>
          &emsp;
            {homeText1}
          </p>
          <p className={styles.homeParagraphs}>
          &emsp;
            {homeText2}
          </p>
          <p className={styles.homeParagraphs}>
          &emsp;
            {homeText3}
          </p> */}
          {/* <div className={styles.homeButtonBox}>
            <button className={visibleWarningButton?"warningOkayButton activeWarningButton" : "warningOkayButton"} id="registerBtn" onClick={handleRegister}>Okay</button>
            <button className={"warningOkayButton activeWarningButton"} id="getStartedBtn" onClick={handleRegister}>Get Started</button>
          </div> */}
        {/* </div> */}

          
    </div>


    {/* <Script src="main.js" type="module"></Script> */}
    <Script src="main2.js" type="module"></Script>

    
    <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js" integrity="sha512-f8mwTB+Bs8a5c46DEm7HQLcJuHMBaH/UFlcgyetMqqkvTcYg4g5VXsYR71b3qC82lZytjNYvBj2pf0VekA9/FQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></Script>
    
  </>
}