import { useContext, useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import { ImProfile, ImMobile } from "react-icons/im";
import { FaDonate, FaEdit } from "react-icons/fa";
import { FiSettings, FiSave } from "react-icons/fi";
import { FaUserAlt, FaSchool } from "react-icons/fa";
import { GoBook } from "react-icons/go";
import { MdOutlineEmail, MdCancel } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import Image from "next/image";
import { BsFillCameraFill, BsCheckCircleFill } from "react-icons/bs";
import { useRef } from "react";
import { updateProfile } from "@/helper/login-utils";
import AuthContext from "@/store/AuthContext";
import Progress from "../Progress";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
// import uuid from "react-uuid";

export default function Profile() {
  const authCtx = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");

  useEffect(()=>{
    if(authCtx && authCtx.userData){
      setName(authCtx.userData.name);
      setEmail(authCtx.userData.email);
      setPhone(authCtx.userData.phone);
      setCollege(authCtx.userData.college);
      setDept(authCtx.userData.dept);
      setYear(authCtx.userData.year);
      setImageFile(authCtx.userData.avatar);
    }
  }, [authCtx.userData])

  const [nameSave, setNameSave] = useState(false);
  const [emailSave, setEmailSave] = useState(false);
  const [phoneSave, setPhoneSave] = useState(false);
  const [collegeSave, setCollegeSave] = useState(false);
  const [deptSave, setDeptSave] = useState(false);
  const [yearSave, setYearSave] = useState(false);

  const fileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUpdatedAvatar, setIsUpdatedAvatar] = useState(false);

  function handleNameChange(e) {
    if (nameSave) {
      setName(e.target.value);
    }
  }
  function handlePhoneChange(e) {
    if (phoneSave) {
      setPhone(e.target.value);
    }
  }
  function handleCollegeChange(e) {
    if (collegeSave) {
      setCollege(e.target.value);
    }
  }
  function handleDeptChange(e) {
    if (deptSave) {
      setDept(e.target.value);
    }
  }
  function handleYearChange(e) {
    if (yearSave) {
      setYear(e.target.value);
    }
  }

  const handleFileChange = (e) => {
    const fileName = e.target.files[0].name;
    const fileTypeArray = fileName.split(".");
    const fileMimeType = fileTypeArray[fileTypeArray.length-1];
    if(fileMimeType==="JPG" || fileMimeType==="jpg" || fileMimeType==="PNG" || fileMimeType==="png" || fileMimeType==="jfif" || fileMimeType==="JFIF" || fileMimeType==="JPEG"||fileMimeType==="jpeg"){
      // setImgError(false);
      const reader = new FileReader();
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
      reader.onload = (readerEvent) => {
        setImageFile(readerEvent.target.result);
        setFile(e.target.files[0]);
      };
      setIsUpdatedAvatar(true);
    }
    else{
      // setImgError(true);
      setIsUpdatedAvatar(false);
      return;
    }
  };

  async function handleUpdateAvatar() {
    const { name, lastModified } = file;
    // const filePath = `avatars/${name}_${lastModified}_${uuid()}`;
    const filePath = `avatars/${authCtx.userId}`;
    const folderRef = ref_storage(storage, filePath);

    const uploadedFile = uploadBytesResumable(folderRef, file);
    uploadedFile.on(
      "state_changed",
      (snapshot) => {
        setProgress(
          Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
        if (snapshot.bytesTransferred === snapshot.totalBytes) {
          setTimeout(() => {
            setProgress(0);
            setFile(null);
            setIsUpdatedAvatar(false);
          }, 1000);
        }
      },
      (error) => {
        // console.log(error);
      },
      () => {
        getDownloadURL(uploadedFile.snapshot.ref).then(async (downloadUrl) => {
          await updateProfile(authCtx.userId, "avatar", downloadUrl);
        });
      }
    );
  }

  const updateName = async ()=>{
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");
    await updateProfile(userId, "name", name);
    setNameSave(false);
    authCtx.updateUserProfile("name", name);
  }
  const updatePhone = async ()=>{
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");
    await updateProfile(userId, "phone", phone);
    setPhoneSave(false);
    authCtx.updateUserProfile("phone", phone);
  }
  const updateCollege = async ()=>{
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");
    await updateProfile(userId, "college", college);
    setCollegeSave(false);
    authCtx.updateUserProfile("college", college);
  }
  const updateDept = async ()=>{
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");
    await updateProfile(userId, "dept", dept);
    setDeptSave(false);
    authCtx.updateUserProfile("dept", dept);
  }
  const updateYear = async ()=>{
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");
    await updateProfile(userId, "year", year);
    setYearSave(false);
    authCtx.updateUserProfile("year", year);
  }

  return (
    <div className={styles.editProfile}>
      <div>
        <form>
          <div className={styles.profileImageEditBox}>
            {!imageFile ? (
              <Image
                src="/assets/anonymous.jpg"
                width={100}
                height={100}
                alt="profileDp"
                className={styles.profileDp}
                draggable={false}
              />
            ) : (
              <Image
                src={imageFile}
                height={100}
                width={100}
                alt="profileDp"
                onClick={() => {
                  setImageFile((authCtx.userData && authCtx.userData.avatar)||null);
                  setIsUpdatedAvatar(false);
                }}
                draggable={false}
                className={styles.profileDp}
              />
            )}

            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            {!isUpdatedAvatar && <div className={styles.cameraBox} onClick={() => {
                  fileRef.current.click();
                }}>
              <BsFillCameraFill className={styles.cameraIcon} />
            </div>}
            {isUpdatedAvatar && <Image src={"/assets/icons/okay.png"} height={100} width={100} alt="okayIcon" className={styles.cameraOkayIcon} onClick={handleUpdateAvatar} draggable={false}/>}

          </div>
        </form>
      </div>
      <div className={styles.progressBox}>
        {progress>0 && <Progress progress={progress}/>}
      </div>

      <form>
        <div className={styles.settingsInputBox}>
          <div
            className={
              nameSave ? "settingsInput abled" : "settingsInput disabled"
            }
          >
            <label className={styles.settingsInputLabel}>Full Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              disabled={!nameSave}
            />
            <FaUserAlt className={styles.settingsInputIcon} />
            {!nameSave && (
              <FaEdit
                className="settingsInputIcon2"
                onClick={() => {
                  setNameSave(true);
                }}
              />
            )}
            {nameSave && <FiSave className={styles.settingsInputIcon3} onClick={updateName}/>}
            {nameSave && (
              <MdCancel
                className={styles.settingsInputIcon4}
                onClick={() => {
                  setNameSave(false);
                  if(authCtx && authCtx.userData){
                    setName(authCtx.userData.name);
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.settingsInputBox}>
          <div
            className={
              emailSave ? "settingsInput abled" : "settingsInput disabled"
            }
          >
            <label className={styles.settingsInputLabel}>Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              disabled={!emailSave}
            />
            <MdOutlineEmail className={styles.settingsInputIcon} />
          </div>
        </div>
        <div className={styles.settingsInputBox}>
          <div
            className={
              phoneSave ? "settingsInput abled" : "settingsInput disabled"
            }
          >
            <label className={styles.settingsInputLabel}>Phone</label>
            <input
              type="number"
              placeholder="Phone"
              value={phone}
              onChange={handlePhoneChange}
              disabled={!phoneSave}
            />
            <ImMobile className={styles.settingsInputIcon} />
            {!phoneSave && (
              <FaEdit
                className="settingsInputIcon2"
                onClick={() => {
                  setPhoneSave(true);
                }}
              />
            )}
            {phoneSave && <FiSave className={styles.settingsInputIcon3} onClick={updatePhone}/>}
            {phoneSave && (
              <MdCancel
                className={styles.settingsInputIcon4}
                onClick={() => {
                  setPhoneSave(false);
                  if(authCtx && authCtx.userData){
                    setPhone(authCtx.userData.phone);
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.settingsInputBox}>
          <div
            className={
              collegeSave ? "settingsInput abled" : "settingsInput disabled"
            }
          >
            <label className={styles.settingsInputLabel}>College</label>
            <input
              type="text"
              placeholder="College"
              value={college}
              onChange={handleCollegeChange}
              disabled={!collegeSave}
            />
            <FaSchool className={styles.settingsInputIcon} />
            {!collegeSave && (
              <FaEdit
                className="settingsInputIcon2"
                onClick={() => {
                  setCollegeSave(true);
                }}
              />
            )}
            {collegeSave && <FiSave className={styles.settingsInputIcon3} onClick={updateCollege}/>}
            {collegeSave && (
              <MdCancel
                className={styles.settingsInputIcon4}
                onClick={() => {
                  setCollegeSave(false);
                  if(authCtx && authCtx.userData){
                    setCollege(authCtx.userData.college);
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.settingsInputBox}>
          <div
            className={
              deptSave ? "settingsInput abled" : "settingsInput disabled"
            }
          >
            <label className={styles.settingsInputLabel}>Department</label>
            <input
              type="text"
              placeholder="Department"
              value={dept}
              onChange={handleDeptChange}
              disabled={!deptSave}
            />
            <RiProfileLine className={styles.settingsInputIcon} />
            {!deptSave && (
              <FaEdit
                className="settingsInputIcon2"
                onClick={() => {
                  setDeptSave(true);
                }}
              />
            )}
            {deptSave && <FiSave className={styles.settingsInputIcon3} onClick={updateDept}/>}
            {deptSave && (
              <MdCancel
                className={styles.settingsInputIcon4}
                onClick={() => {
                  setDeptSave(false);
                  if(authCtx && authCtx.userData){
                    setDept(authCtx.userData.dept);
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.settingsInputBox}>
          <div
            className={
              yearSave ? "settingsInput abled" : "settingsInput disabled"
            }
          >
            <label className={styles.settingsInputLabel}>Expected Graduation Year</label>
            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={handleYearChange}
              disabled={!yearSave}
            />
            <GoBook className={styles.settingsInputIcon} />
            {!yearSave && (
              <FaEdit
                className="settingsInputIcon2"
                onClick={() => {
                  setYearSave(true);
                }}
              />
            )}
            {yearSave && <FiSave className={styles.settingsInputIcon3} onClick={updateYear}/>}
            {yearSave && (
              <MdCancel
                className={styles.settingsInputIcon4}
                onClick={() => {
                  setYearSave(false);
                  if(authCtx && authCtx.userData){
                    setYear(authCtx.userData.year);
                  }
                }}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
