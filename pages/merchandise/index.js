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
import { bookMerchandise } from "@/helper/login-utils";
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
  const [paymentCollector, setPaymentCollector] = useState("ayush");
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
    if (fullname.trim().length === 0 || phone.trim().length === 0 || college.trim().length === 0 || dept.trim().length === 0 || tshirtName.trim().length === 0 || (paymentMethod === "UPI" && transactionId.trim().length === 0) || (paymentMethod === "UPI" && file===null)) {
      notification['error']({
        message: `All fields are mandatory`,
        duration: 3
      })
      authCtx.stopLoading();
      return;
    }
    // const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    // const isEmailValid = emailRegex.test(email);
    // if (!isEmailValid) {
    //   notification['error']({
    //     message: `Invalid email input`,
    //     duration: 2
    //   })
    //   authCtx.stopLoading();
    //   return;
    // }
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
  }

  const acceptGuideline = async () => {
    setVisibleGuidelinesModal(false);
    authCtx.startLoading();

    if(isPaymentOnline){
      onValue(ref_database(database, 'srijan/merchandise/' + transactionId) , (snapshot)=>{
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
                    await bookMerchandise(fullname, authCtx.userData.email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod, transactionId, paymentCollector, downloadUrl);
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
                    setPaymentCollector("ayush");
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
      await bookMerchandise(fullname, authCtx.userData.email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod, uuid().replace(/[.+-]/g, "_"), paymentCollector, "");
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
        setPaymentCollector("ayush");
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

      <Modal
        isOpen={visibleGuidelinesModal}
        onRequestClose={() => {
          toggleVisibleGuidelinesModal();
        }}
        className={styles.guidelinesModal}
        ariaHideApp={false}
        style={customEventModalStyles}
        closeTimeoutMS={700}
      >
        <div>
          <h2><Image src={"/assets/warning.png"} height={50} width={50} alt="warning" draggable={false} className={styles.dangerIcon} />CAUTION</h2>
          <IoMdClose className={styles.exitIcon} onClick={toggleVisibleGuidelinesModal} />
          <p>&emsp;By accepting, you agree that you have gone through the guidelines. In case you have not done please <span className={styles.guidelineLink} onClick={()=>{toggleVisibleGuidelinesModal(); toggleVisibleInstructionsModal();}}>click here</span> and take a few minutes to read and understand them.</p>
          <button onClick={acceptGuideline}>Accept</button>
        </div>
      </Modal>

      <Modal isOpen={visibleInstructionsModal}
        onRequestClose={() => {
          toggleVisibleInstructionsModal();
        }}
        className={styles.instructionsModal}
        ariaHideApp={false}
        style={customEventModalStyles}
        closeTimeoutMS={700}
      >
        <div>
          <h2>Order a SRIJAN'23 Official Merchandise</h2>
            <div className={styles.paymentScannerBox}>
              <div>
                <Image src={"/assets/ayush_qr.jpg"} height={300} width={300} alt="qr_image" className={styles.qrScannerImage} draggable={false} />
                <h4>Ayush Mishra</h4>
                <h5>ayushdtps@oksbi</h5>
              </div>
              <div>
                <Image src={"/assets/bitan_qr.jpg"} height={300} width={300} alt="qr_image" className={styles.qrScannerImage} draggable={false} />
                <h4>Bitan Banerjee</h4>
                <h5>bbanerjeeagp@oksbi</h5>
              </div>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span> You can order your merchandise in both - Offline & Online mode </span>
            </div>
            {/* <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span> To order in offline mode: please contact with <strong>Trishit Pal</strong> [ 1234567890 ] or <strong>Ayush Mishra</strong> [ 9876543210 ] </span>
            </div> */}
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>At first, enter the details such as name, email, mobile, college, dept in the Merchandise Form</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>Enter the name you want to print upon your SRIJAN Merchandise. If you don't want any name printed upon the Tshirt, write "NA"</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>Choose size of the Tshirt i.e. suitable for you</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>If you want to order merchandise via Cash, select "CASH" and complete the payment to one of the Payment Collectors within a day</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>If you want to make the payment via UPI, please select "UPI" and complete the payment to one of the Payment Collector within a day via <strong>Google Pay</strong>, <strong>Phone Pe</strong>, <strong>Amazon Pay</strong>, <strong>Paytm</strong> or <strong>Whatsapp Pay</strong></span>
            </div>

            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>If you select method: "UPI", 2 more fields will be visible where you have to give the Transaction ID & Transaction Screenshot. [ <strong>PS:</strong> provide the 12 digit unique numeric number (UTR) e.g. <i>123456789012</i> ]</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span>Now select Campus where you want to complete your payment and then place your order</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span><b>Congrats! Your order has been placed.</b> You can check the order status in your Dashboard</span>
            </div>
            <div className={styles.instructions}>
              <TfiHandPointRight className={styles.instructionBullets}/> <span> For any further queries, reach out to Ayush Mishra [ 8927898690 ] or Bitan Banerjee [ 7439377598 ] anytime</span>
            </div>
            {/* please scan any one of the two QR codes shown above. If you choose 1st one, then at the time  */}

            <div className={styles.merchandiseUnderstoodButtonBox}>
              <button onClick={toggleVisibleInstructionsModal}>Ok, I understand</button>
            </div>
        </div>
      </Modal>

      <div className={styles.merchandiseContainer}>
        <div className={styles.merchandiseHeading}>
          Srijan'23 Official Merchandise
        </div>

        <div className={styles.merchandiseBody}>
          {/* <div className={styles.merchandisePhotos}>
            <div className={styles.merchandisePhotoBox}>
              <Image
                src={"/assets/black-web.jpg"}
                height={300}
                width={500}
                alt="black-tshirt"
                className={styles.merchandisePhoto}
                draggable="false"
              />
            </div>
            <div className={styles.merchandisePhotoBox}>
              <Image
                src={"/assets/white-web.jpg"}
                height={300}
                width={500}
                alt="black-tshirt"
                className={styles.merchandisePhoto}
                draggable="false"
              />
            </div>
          </div> */}

          <div className={styles.productZoomContainer}>
            <div className={styles.productsZoomSection}>
              <div className={styles.productLeftSidebar}>
                {merchandiseImages.map((merchandiseImage, i) => {
                  return (
                    <div className={styles.productImageWrap} key={i} onMouseOver={() => { loadImageOnHover(i) }}>
                      <Image height={40} width={40} src={merchandiseImage} alt="productImageIcon" draggable={false} className={currImage === merchandiseImage ? "productImageActiveIcons" : "productImageIcons"} />
                    </div>
                  )
                })}
              </div>
              <div className={styles.productsPicture}>
                <Image height={400} width={500} src={currImage} alt="productImage" className={styles.productImageScreen} draggable={false} />
                {/* <div className={styles.productImageScreen}>
                  <ReactImageMagnify {...{
                          smallImage: {
                              alt: 'productScreenImage',
                              isFluidWidth: true,
                              src: currImage,
                              width: 100,
                              height: 200
                              // sizes: "(min-width: 1000px) 33.5vw, (min-width: 415px) 50vw, 100vw"
                          },
                          largeImage: {
                              src: currImage,
                              width: 1200,
                              height: 1800
                          },
                          enlargedImageContainerDimensions: {
                            width: '150%',
                            height: '150%'
                        }
                  }}/>
                </div> */}
              </div>
            </div>
            <br />
            {/* <div className={styles.offlinePaymentDetails}>
              Srijan'23 Official Merchandise
            </div> */}
            <div className={styles.offlinePaymentDetails}>
              <button className={styles.merchandiseInstructionButton} onClick={toggleVisibleInstructionsModal}>How to Order a SRIJAN Merchandise?</button>
            </div>
            <div className={styles.merchandisePrice}>
              <h4>Only for Rs. 380/-</h4>
            </div>
          </div>



          <div className={styles.merchandiseForm} id="merchandiseForm">
            {!authCtx.isAuthenticated && 
              <div className={styles.eventEndRightButtonBox}>
                <button
                  className={"interestedRegisteredButton"}
                  onClick={goToLoginPage}
                >
                  Sign in to Order Merchandise
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
                <div className={styles.registerInput}>
                  <label htmlFor="tshirtName" className={styles.registerInputLabel}>Name on Tshirt</label>
                  <input
                    type="text"
                    placeholder="Enter the name to be printed on the Tshirt"
                    id="tshirtName"
                    value={tshirtName} onChange={(e) => { setTshirtName(e.target.value) }}
                  />
                  <TfiPencilAlt className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="tshirtColor" className={styles.registerInputLabel}>Tshirt Color</label>
                  <select id="tshirtColor" value={tshirtColor} onChange={(e) => { setTshirtColor(e.target.value) }}>
                    <option value="Black">Black</option>
                  </select>
                  <IoIosColorPalette className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="tshirtSize" className={styles.registerInputLabel}>Tshirt Size</label>
                  <select id="tshirtSize" value={tshirtSize} onChange={(e) => { setTshirtSize(e.target.value) }}>
                    <option value="S">S(38)</option>
                    <option value="M">M(40)</option>
                    <option value="L">L(42)</option>
                    <option value="XL">XL(44)</option>
                    <option value="XXL">XXL(46)</option>
                    <option value="XXXL">XXXL(48)</option>
                  </select>
                  <SlSizeFullscreen className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput2}>
                  <label htmlFor="paymentMode" className={styles.registerInputLabel}>Payment Mode</label>
                  <div className={styles.paymentOptions}>
                    <input type="radio" value="Cash" checked={paymentMethod === "Cash"} id="paymentMode" onChange={(e) => { setPaymentMethod(e.target.value); selectCash(); }} />
                    <div>Cash</div>
                  </div>
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
                  <input type="text" value={transactionId} id="transactionId" onChange={(e) => { setTransactionId(e.target.value) }} placeholder="Enter the UPI Transaction ID" />
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
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="paymentCollector" className={styles.registerInputLabel}>Campus</label>
                  <select id="[paymentCollector]" value={paymentCollector} onChange={(e) => { setPaymentCollector(e.target.value) }}>
                    <option value="ayush">Salt Lake Campus</option>
                    <option value="bitan">Jadavpur Campus</option>
                  </select>
                  <MdPlace className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                  <label htmlFor="paymentCollector" className={styles.registerInputLabel}>Payment Collector</label>
                  <select id="paymentCollector" value={paymentCollector} disabled onChange={(e) => { setPaymentCollector(e.target.value) }}>
                    <option value="ayush">Ayush Mishra ( SL Campus )</option>
                    <option value="bitan">Bitan/Jyotishman ( JU Campus )</option>
                  </select>
                  <SlSizeFullscreen className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.centerBox}>
                <button className={styles.registerButton}>Place Order</button>
              </div>
            </form>}
          </div>
        </div>
        {/* <div className={styles.offlinePaymentDetails}>
          For offline payment, please contact: <br />
          Trishit Pal: 9831660378 <br />
          Suvankar: 7001082597
        </div> */}
      </div>
    </>
  );
}
