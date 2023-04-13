import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import styles from "../../styles/Dashboard.module.css";
import AuthContext from "@/store/AuthContext";
import RegisterPage2 from "@/components/Register/Register2";
import PermissionDeniedPage from "@/components/PermissionError";

function AdminWorkshopDetailsPage() {
  const authCtx = useContext(AuthContext);

  if(!authCtx.isAuthenticated){
    return (
        <RegisterPage2/>
    )
  }
  if(!["ghoshdebo2000", "halderarindam10000"].includes(authCtx.userId)){
    return (
        <PermissionDeniedPage/>
    )
  }

  const [workshop, setWorkshop] = useState([]);

  useEffect(() => {
    authCtx.stopLoading();
    onValue(
      ref_database(database, "srijan/workshop"),
      (snapshot) => {
        if (snapshot) {
          let workshopsArray = [];
          const workshopsResult = snapshot.val();
          for (let workshop in workshopsResult) {
            workshopsArray.push({ ...workshopsResult[workshop], workshopId: workshop });
          }
          setWorkshop(workshopsArray);
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
          Workshop Database
        </div>
        <div className="adminHeading">
          {workshop && (
            <div className={styles.dashboardSectionHeading3}>
              {workshop.length} Registered
            </div>
          )}
        </div>
        <br />

        <div className={styles.userDetailsContainer}>
          {workshop &&
            workshop.length > 0 &&
            workshop.map((workshop, idx) => {
              return (
                <div className={styles.adminEventDetailsBox} key={idx}>
                  <div className={styles.eventDetailsTop}>
                    <h4>{workshop.fullname}</h4>
                  </div>
                  <div className={styles.userDetailsMid}>
                    <p>
                      Email:{" "}
                      <span>
                        {workshop.email}
                      </span>
                    </p>
                    <p>
                      Phone: {" "}
                      <span>
                        {workshop.phone}
                      </span>
                    </p>
                    <p>
                      College: {" "}
                      <span>
                        {workshop.college}
                      </span>
                    </p>
                    <p>
                      Dept: {" "}
                      <span>
                        {workshop.dept}
                      </span>
                    </p>
                    <p>
                      Payment Mode: {" "}
                      <span>
                        {workshop.paymentMethod}
                      </span>
                    </p>
                    <p>
                      Transaction ID: {" "}
                      <span>
                        {workshop.transactionId}
                      </span>
                    </p>
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
export default AdminWorkshopDetailsPage;