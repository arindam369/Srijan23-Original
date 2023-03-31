import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { FaUserAlt, FaSchool } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineEmail } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { ImMobile } from "react-icons/im";
import { IoIosColorPalette } from "react-icons/io";
import { SlSizeFullscreen } from "react-icons/sl";
import {HiIdentification} from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import { useContext } from "react";
import AuthContext from "@/store/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import { bookMerchandise } from "@/helper/login-utils";
import { notification } from "antd";
import Head from "next/head";

export default function MerchandisePage() {
  const authCtx = useContext(AuthContext);

  useEffect(()=>{
    authCtx.stopLoading();
  }, [])

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
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
  // const fileRef = useRef(null);
  // const [imageFile, setImageFile] = useState(null);
  // const [file, setFile] = useState(null);
  // const [progress, setProgress] = useState(0);
  const [isUpdatedAvatar, setIsUpdatedAvatar] = useState(false);
  const [paymentCollector, setPaymentCollector] = useState("trishit");

  const handleMerchandiseBook = async (e)=>{
    e.preventDefault();
    authCtx.startLoading();

    // handle all validations
    if(fullname.trim().length === 0 || email.trim().length === 0 || phone.trim().length === 0 || college.trim().length === 0 || dept.trim().length === 0 || tshirtName.trim().length === 0){
      // setError("All fields are mandatory");
      notification['error']({
        message: `All fields are mandatory`,
        duration: 2
    })
      authCtx.stopLoading();
      return;
    }
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const isEmailValid = emailRegex.test(email);
    if(!isEmailValid){
        notification['error']({
          message: `Invalid email input`,
          duration: 2
      })
        authCtx.stopLoading();
        return;
    }
    // setError(null);
    
    // store data in firebase
    await bookMerchandise(fullname, email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod);
    setFullname("");
    setEmail("");
    setPhone("");
    setCollege("");
    setDept("");
    setTshirtName("");
    setTshirtColor("Black");
    setTshirtSize("L");
    setPaymentMethod("Cash");
    authCtx.stopLoading();
  }

  const merchandiseImages = [
    "/assets/tshirts/black_front.png",
    "/assets/tshirts/black_back.png",
    "/assets/tshirts/white_front.png",
    "/assets/tshirts/white_back.png",
  ]
  const [currImage, setCurrImage] = useState(merchandiseImages[0]);
  const loadImageOnHover = (index)=>{
    setCurrImage(merchandiseImages[index]);
  }

  const selectUpi = ()=>{
    setIsPaymentOnline(true);
  }
  const selectCash = ()=>{
    setIsPaymentOnline(false);
  }

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
                {merchandiseImages.map((merchandiseImage, i)=>{
                  return (
                    <div className={styles.productImageWrap} key={i} onMouseOver={()=>{loadImageOnHover(i)}}>
                      <Image height={40} width={40} src={merchandiseImage} alt="productImageIcon" draggable={false} className={currImage===merchandiseImage?"productImageActiveIcons":"productImageIcons"}/>
                    </div>
                  )
                })}
              </div>
              <div className={styles.productsPicture}>
                <Image height={100} width={200} src={currImage} alt="productImage" className={styles.productImageScreen} draggable={false}/>
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
            <div className={styles.offlinePaymentDetails}>
            Srijan'23 Official Merchandise
        </div>
          </div>



          <div className={styles.merchandiseForm} id="merchandiseForm">
            <form onSubmit={handleMerchandiseBook}>
                  {/* {error && <div className={styles.errorBox2}>
                    {error}
                  </div>} */}
              <div className={styles.registerInputBox}>
                
                <div className={styles.registerInput}>
                <label htmlFor="fullname" className={styles.registerInputLabel}>Full Name</label>
                  <input type="text" placeholder="Enter your full name" id="fullname" value={fullname} onChange={(e)=>{setFullname(e.target.value)}}/>
                  <FaUserAlt className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="email" className={styles.registerInputLabel}>Email</label>
                  <input type="text" placeholder="Enter your email id" id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                  <MdOutlineEmail className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="mobile" className={styles.registerInputLabel}>Mobile</label>
                  <input type="number" placeholder="Enter your mobile number" id="mobile" value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
                  <ImMobile className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                <label htmlFor="college" className={styles.registerInputLabel}>College</label>
                  <input type="text" placeholder="Enter your college name" id="college" value={college} onChange={(e)=>{setCollege(e.target.value)}}/>
                  <FaSchool className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                <label htmlFor="dept" className={styles.registerInputLabel}>Department</label>
                  <input type="text" placeholder="Enter your department name" id="dept" value={dept} onChange={(e)=>{setDept(e.target.value)}}/>
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
                    value={tshirtName} onChange={(e)=>{setTshirtName(e.target.value)}}
                  />
                  <TfiPencilAlt className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                <label htmlFor="tshirtColor" className={styles.registerInputLabel}>Tshirt Color</label>
                  <select id="tshirtColor" value={tshirtColor} onChange={(e)=>{setTshirtColor(e.target.value)}}>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                  </select>
                  <IoIosColorPalette className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="tshirtSize" className={styles.registerInputLabel}>Tshirt Size</label>
                    <select id="tshirtSize" value={tshirtSize} onChange={(e)=>{setTshirtSize(e.target.value)}}>
                        <option value="S">S(38)</option>
                        <option value="M">M(40)</option>
                        <option value="L">L(42)</option>
                        <option value="XL">XL(44)</option>
                        <option value="XXL">XXL(46)</option>
                    </select>
                  <SlSizeFullscreen className={styles.registerIcon} />
                </div>
              </div>
              <div className={styles.registerInputBox}>
                <div className={styles.registerInput2}>
                    <label htmlFor="paymentMode" className={styles.registerInputLabel}>Payment Mode</label>
                    <div className={styles.paymentOptions}>
                        <input type="radio" value="Cash" checked={paymentMethod==="Cash"} id="paymentMode" onChange={(e)=>{setPaymentMethod(e.target.value); selectCash();}} />
                        <div>Cash</div>
                    </div>
                    <div className={styles.paymentOptions}>
                        <input type="radio" value="UPI" checked={paymentMethod === "UPI"} id="paymentMode" onChange={(e)=>{setPaymentMethod(e.target.value); selectUpi();}}/> 
                        <div>UPI</div>
                    </div>
                  <MdPayment className={styles.registerIcon} />
                </div>
              </div>
              {isPaymentOnline && <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="transactionId" className={styles.registerInputLabel}>Transaction ID</label>
                    <input type="text" value={transactionId} id="transactionId" onChange={(e)=>{setTransactionId(e.target.value)}} placeholder="Enter the UPI Transaction ID" />
                  <HiIdentification className={styles.registerIcon} />
                </div>
              </div>}
              {isPaymentOnline && <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="transactionScreenshot" className={styles.registerInputLabel}>Transaction Screenshot</label>
                    <input type="file" id="transactionScreenshot" accept="image/*" />
                  <HiIdentification className={styles.registerIcon} />
                </div>
              </div>}
              {isPaymentOnline && <div className={styles.registerInputBox}>
                <div className={styles.registerInput}>
                    <label htmlFor="paymentCollector" className={styles.registerInputLabel}>Payment Collector</label>
                    <select id="[paymentCollector]" value={paymentCollector} onChange={(e)=>{setPaymentCollector(e.target.value)}}>
                        <option value="trishit">Trishit Pal</option>
                        <option value="ayush">Ayush Mishra</option>
                    </select>
                  <SlSizeFullscreen className={styles.registerIcon} />
                </div>
              </div>}
              <div className={styles.centerBox}>
              <button className={styles.registerButton}>Place Order</button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.offlinePaymentDetails}>
            For offline payment, please contact: <br/>
            Trishit Pal: 9831660378 <br/>
            Suvankar: 7001082597
        </div>
      </div>
    </>
  );
}
