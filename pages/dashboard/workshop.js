import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { FaUserAlt, FaSchool } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineEmail, MdPlace } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { ImMobile } from "react-icons/im";
import { IoIosColorPalette, IoMdClose } from "react-icons/io";
import { SlSizeFullscreen } from "react-icons/sl";
import { HiIdentification } from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import {TfiHandPointRight} from "react-icons/tfi";
import { useContext, useRef } from "react";
import AuthContext from "@/store/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import { bookMerchandise, bookWorkshop } from "@/helper/login-utils";
import { notification } from "antd";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { update, ref as ref_database, onValue } from "firebase/database";
import Head from "next/head";
import Modal from "react-modal";
import Link from "next/link";
import { database, storage } from "@/firebase";
import uuid from "react-uuid";
import { useRouter } from "next/router";


export default function MerchandisePage() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    authCtx.stopLoading();
  }, [])

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [tshirtName, setTshirtName] = useState("");
  const [tshirtColor, setTshirtColor] = useState("Black");
  const [tshirtSize, setTshirtSize] = useState("L");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isPaymentOnline, setIsPaymentOnline] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  // const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(null);
  // const [progress, setProgress] = useState(0);
  const [paymentCollector, setPaymentCollector] = useState("");
  const [visibleGuidelinesModal, setVisibleGuidelinesModal] = useState(false);
  const [visibleInstructionsModal, setVisibleInstructionsModal] = useState(false);
  const toggleVisibleGuidelinesModal = () => {
    setVisibleGuidelinesModal(!visibleGuidelinesModal);
  }
  const toggleVisibleInstructionsModal = () => {
    setVisibleInstructionsModal(!visibleInstructionsModal);
  }

  function handleFileChange(e) {
    const fileName = e.target.files[0].name;
    const fileTypeArray = fileName.split(".");
    const fileMimeType = fileTypeArray[fileTypeArray.length-1];
    if(fileMimeType==="JPG" || fileMimeType==="jpg" || fileMimeType==="PNG" || fileMimeType==="png" || fileMimeType==="jfif" || fileMimeType==="JFIF" || fileMimeType==="JPEG"||fileMimeType==="jpeg"){
      setFile(e.target.files[0]);
    }
    else{
      notification['error']({
        message: `Please upload JPG/JPEG/PNG/JFIF files`,
        duration: 5
      })
      authCtx.stopLoading();
      return;
    }
  }

  const handleMerchandiseBook = async (e) => {
    e.preventDefault();

    // handle all validations
    if (fullname.trim().length === 0 || phone.trim().length === 0 || college.trim().length === 0 || dept.trim().length === 0 ||  (transactionId.trim().length === 0) || (file===null)) {
      notification['error']({
        message: `All fields are mandatory`,
        duration: 3
      })
      authCtx.stopLoading();
      return;
    }
    const transactionIdRegex = /^[0-9]{12}$/;
    const isTransactionIdValid = transactionIdRegex.test(transactionId);
    if (paymentMethod === "UPI" && !isTransactionIdValid) {
      notification['error']({
        message: `Invalid Transaction Id, please see the instructions carefully`,
        duration: 5
      })
      authCtx.stopLoading();
      return;
    }
    toggleVisibleGuidelinesModal();
    acceptGuideline();
  }

  const acceptGuideline = async () => {
    setVisibleGuidelinesModal(false);
    authCtx.startLoading();

    if(isPaymentOnline){
      onValue(ref_database(database, 'srijan/workshop/' + transactionId) , (snapshot)=>{
        if(snapshot){
            const foundOrder = snapshot.val();
            if(foundOrder!==null){  // already present an order with this transactionId
              notification['error']({
                message: `One order is already placed with this transaction id`,
                duration: 8
              })
              authCtx.stopLoading();
              return;
            }
            else{
                const {name} = file;
                const filePath = `payment/${name}_${new Date().getTime()}`;
                const folderRef = ref_storage(storage, filePath);

                const uploadedFile = uploadBytesResumable(folderRef, file);
                uploadedFile.on("state_changed", (snapshot)=>{
                  if(snapshot.bytesTransferred === snapshot.totalBytes){
                    setFile(null);
                  }
                },(error)=>{
                  console.log(error);
                  authCtx.stopLoading();
                },()=>{
                  getDownloadURL(uploadedFile.snapshot.ref).then(async (downloadUrl)=>{
                    await bookWorkshop(fullname, authCtx.userData.email, phone, college, dept, paymentMethod, transactionId, downloadUrl);
                    setFullname("");
                    setPhone("");
                    setCollege("");
                    setDept("");
                    setTshirtName("");
                    setTshirtColor("Black");
                    setTshirtSize("L");
                    setPaymentMethod("Cash");
                    setIsPaymentOnline(false);
                    setTransactionId("");
                    setPaymentCollector("");
                    setFile(null);
                    authCtx.stopLoading();
                  })
                })
            }
        }
      }, {
          onlyOnce: true
      });
    }
    else{
      await bookWorkshop(fullname, authCtx.userData.email, phone, college, dept, paymentMethod, uuid().replace(/[.+-]/g, "_"), "");
        setFullname("");
        setPhone("");
        setCollege("");
        setDept("");
        setTshirtName("");
        setTshirtColor("Black");
        setTshirtSize("L");
        setPaymentMethod("Cash");
        setIsPaymentOnline(false);
        setTransactionId("");
        setPaymentCollector("");
        setFile(null);
        authCtx.stopLoading();
    }
  }

  const merchandiseImages = [
    "/assets/tshirts/tshirt_front.png",
    "/assets/tshirts/tshirt_back.png",
    "/assets/tshirts/tshirt_srijan.png",
    // "/assets/tshirts/tshirt_logo.png",
  ]
  const [currImage, setCurrImage] = useState(merchandiseImages[0]);

  const loadImageOnHover = (index) => {
    setCurrImage(merchandiseImages[index]);
  }
  const selectUpi = () => {
    setIsPaymentOnline(true);
  }
  const selectCash = () => {
    setIsPaymentOnline(false);
  }
  const customEventModalStyles = {
    overlay: {
      background: "rgba(0,0,0,0.65)",
      zIndex: "100"
    }
  };
  
  const router = useRouter();
  const goToLoginPage = () => {
    router.push("/register");
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="manifest.json" />
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

      <div className={styles.merchandiseContainer}>
        <div className={styles.merchandiseHeading}>
          Game Development Workshop
        </div>

            <p className="workshopData">
                <p>
                Game Development Workshop organised by Gaming Society Jadavpur University<br/> 45 seats only &emsp; 2 day workshop on 14th and 15th April on game dev, design, strategy and marketing</p> <br/>
            <p>Requirements: A decent Laptop(requirement as specified by the Unreal Documentation By Epic), Unreal Engine 5.0(built for the souce), some external texture pack for the enemy.</p>
            <br/><p>
            Refreshments and Tshirts included in th package.</p>    <br/>
            <p>For Payment: &emsp;UPI - 8902287177, &emsp;ghoshdebo2000@oksbi</p>




 </p>
        <div className={styles.merchandiseBody}>

          <div className={styles.productZoomContainer}>
            <div className={styles.productsZoomSection}>
              <div className={styles.productsPicture}>
                <Image height={400} width={500} src={"/assets/workshops/dev_workshop.png"} alt="productImage" className={styles.productImageScreen} draggable={false} />
              </div>
            </div>
            <br />
            {/* <div className={styles.offlinePaymentDetails}>
              Srijan'23 Official Merchandise
            </div> */}
            {/* <div className={styles.offlinePaymentDetails}>
              <button className={styles.merchandiseInstructionButton} onClick={toggleVisibleInstructionsModal}>How to Order a SRIJAN Merchandise?</button>
            </div> */}
            <div className={styles.merchandisePrice}>
              <h4>Only for Rs. 649/-</h4>
            </div>
          </div>



          <div className={styles.merchandiseForm} id="merchandiseForm">
            {!authCtx.isAuthenticated && 
              <div className={styles.eventEndRightButtonBox}>
                <button
                  className={"interestedRegisteredButton"}
                  onClick={goToLoginPage}
                >
                  Sign in to Register for Workshop
                </button>
              </div>}
            {authCtx.isAuthenticated && <form onSubmit={handleMerchandiseBook}>
              <div className={styles.registerInputBox}>

                <div className={styles.registerInput}>
                  <label htmlFor="fullname" className={styles.registerInputLabel}>Full Name</label>
                  <input type="text" placeholder="Enter your full name" id="fullname" value={fullname} onChange={(e) => { setFullname(e.target.value) }} />
                  <FaUserAlt className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="email" className={styles.registerInputLabel}>Email</label>
                  <input type="text" placeholder="Enter your email id" id="email" value={authCtx.userData && authCtx.userData.email} disabled/>
                  <MdOutlineEmail className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="mobile" className={styles.registerInputLabel}>Mobile</label>
                  <input type="number" placeholder="Enter your mobile number" id="mobile" value={phone} onChange={(e) => { setPhone(e.target.value) }} />
                  <ImMobile className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="college" className={styles.registerInputLabel}>College</label>
                  <input type="text" placeholder="Enter your college name" id="college" value={college} onChange={(e) => { setCollege(e.target.value) }} />
                  <FaSchool className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="dept" className={styles.registerInputLabel}>Department</label>
                  <input type="text" placeholder="Enter your department name" id="dept" value={dept} onChange={(e) => { setDept(e.target.value) }} />
                  <RiProfileLine className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput2}>
                  <label htmlFor="paymentMode" className={styles.registerInputLabel}>Payment Mode</label>
                  <div className={styles.paymentOptions}>
                    <input type="radio" value="UPI" checked={paymentMethod === "UPI"} id="paymentMode" onChange={(e) => { setPaymentMethod(e.target.value); selectUpi(); }} />
                    <div>UPI</div>
                  </div>
                  <MdPayment className={styles.registerIcon} />
                </div>
              </div>
              {isPaymentOnline && <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="transactionId" className={styles.registerInputLabel}>Transaction ID</label>
                  <input type="text" value={transactionId} id="transactionId" onChange={(e) => { setTransactionId(e.target.value) }} placeholder="Enter the 12 Digit UPI Transaction ID" />
                  <HiIdentification className={styles.registerIcon} />
                </div>
              </div>}
              {isPaymentOnline && <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="transactionScreenshot" className={styles.registerInputLabel}>Transaction Screenshot</label>
                    <input type="file" ref={fileRef} onChange={handleFileChange} id="transactionScreenshot" accept="image/*" />
                    {/* <div className={styles.transactionSSButton} onClick={() => {
                      fileRef.current.click();
                    }}>Upload Screenshot </div> */}
                    <HiIdentification className={styles.registerIcon} />
                </div>
              </div>}
         <div className={styles.centerBox}>
                <button className={styles.registerButton} >Register</button>
                {/* <button className={"interestedButton"} disabled>Order Closed</button> */}
              </div> 
            </form>}
          </div>
        </div>
        <div className={styles.offlinePaymentDetails}>
          Contact for more details <br />
          Anurag Ghosh: +91 9051650603 <br />
          Subhadip De: +91 8584038115
        </div>
      </div>
    </>
  );
}
