import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { onValue, ref as ref_database, update } from "firebase/database";
import { database } from "@/firebase";
import { getMerchandiseAdminById } from "@/helper/event-utils";
import styles from "../../../styles/Dashboard.module.css";
import AuthContext from "@/store/AuthContext";
import RegisterPage2 from "@/components/Register/Register2";
import PermissionDeniedPage from "@/components/PermissionError";
import { merchandiseAdmins } from "@/helper/merchandiseAdmins";
import { notification } from "antd";

function AdminEventDetailsPage({ merchantData }) {
    const authCtx = useContext(AuthContext);

    if(!authCtx.isAuthenticated){
        return (<RegisterPage2/>)
    }
    if(!merchantData.merchantEmail.includes(authCtx.userId)){
        return (<PermissionDeniedPage/>)
    }

    if (!merchantData) {
        return <h2 className={styles.noEventsFound}>No Merchandise Found</h2>;
    }

    const [merchandiseDetails, setMerchandiseDetails] = useState([]);
    const [merchandiseChange, setMerchandiseChange] = useState(false);

    useEffect(() => {
        authCtx.stopLoading();
        onValue(ref_database(database, `srijan/merchandise`), (snapshot) => {
            if (snapshot) {
                let merchandiseDetailsArray = [];
                const merchandiseDetailsResult = snapshot.val();
                for (let merchandise in merchandiseDetailsResult) {
                    if(merchandiseDetailsResult[merchandise].paymentCollector === merchantData.merchantTitle && merchandiseDetailsResult[merchandise].verified === false){
                      merchandiseDetailsArray.push({ ...merchandiseDetailsResult[merchandise], merchandiseKey: merchandise });
                    }
                }
                setMerchandiseDetails(merchandiseDetailsArray);
            }
        },
        {
            onlyOnce: true,
        }
        );
    }, [merchandiseChange]);


    function acceptMerchandise(merchandiseId){
      update(ref_database(database, 'srijan/merchandise/' + merchandiseId), {
          verified: true,
          status: "accepted"
      }).then(()=>{
          setMerchandiseChange(!merchandiseChange);
          notification['success']({
              message: `Order accepted successfully`,
              duration: 6
          })
      });
    }
    function rejectMerchandise(merchandiseId){
      update(ref_database(database, 'srijan/merchandise/' + merchandiseId), {
          verified: true,
          status: "rejected"
      }).then(()=>{
          setMerchandiseChange(!merchandiseChange);
          notification['success']({
              message: `Order rejected successfully`,
              duration: 6
          })
      });
    }

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
          {merchantData.merchantName}'s Merchandise Database
        </div>
        {merchandiseDetails && (
          <div className={styles.dashboardSectionHeading3}>
            {merchandiseDetails.length} Orders Pending
          </div>
        )}
        <br />
        <div className={styles.userDetailsContainer}>
          {merchandiseDetails && merchandiseDetails.length > 0 && merchandiseDetails.map((merchandise, idx) => {
              return (
                <div className={styles.adminMerchandiseDetailsBox} key={idx}>
                  <div className={styles.eventDetailsTop}>
                    <h4>{merchandise.fullname}</h4>
                  </div>
                  <div className={styles.userDetailsMid}>
                    <p>
                      Email: <span>{merchandise.email}</span>
                    </p>
                    <p>
                        Mobile: <span>{merchandise.phone}</span>
                    </p>
                    <p>
                      Dept: <span>{merchandise.dept}</span>
                      &emsp;
                    {/* </p>
                    <p> */}
                      College: <span>{merchandise.college}</span>
                    </p>
                    <p>
                      Name on Tshirt: <span>{merchandise.tshirtName}</span>
                    </p>
                    <p>
                      Tshirt Color: <span>{merchandise.tshirtColor}</span>
                    &emsp;
                    {/* </p>
                    <p> */}
                      Tshirt Size: <span>{merchandise.tshirtSize}</span>
                    </p>
                    <p>
                      Payment Method: <span>{merchandise.paymentMethod}</span>
                    </p>
                    {merchandise.transactionId && <p>
                      Transaction ID: <span>{merchandise.transactionId}</span>
                    </p>}
                    <p>
                      Payment Collector: <span>{merchandise.paymentCollector}</span>
                    </p>
                  </div>
                    <div className={styles.acceptRejectbuttonBox2}>
                        <button className={styles.acceptButton} onClick={()=>{acceptMerchandise(merchandise.id)}}>Accept</button>
                        <button className={styles.rejectButton} onClick={()=>{rejectMerchandise(merchandise.id)}}>Reject</button>
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

export async function getStaticProps(context) {
    const { params } = context;
    const merchantID = params.merchantId;
    const merchant = getMerchandiseAdminById(merchantID);
    const notFound = merchant ? false : true;

    return { props: { merchantData: merchant }, notFound };
}
export async function getStaticPaths() {
    const merchandiseAdminsArray = merchandiseAdmins;
    const merchantID_path = merchandiseAdminsArray && merchandiseAdminsArray.map((merchant) => ({
        params: { merchantId: merchant.merchantId },
    }));

    return {
        paths: merchantID_path,
        fallback: true,
    };
}
export default AdminEventDetailsPage;