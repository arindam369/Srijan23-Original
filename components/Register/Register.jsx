import styles from "../../styles/Home.module.css";
import {FaUserAlt, FaSchool} from "react-icons/fa";
import {GoBook} from "react-icons/go";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordFill, RiProfileLine} from "react-icons/ri";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { ImMobile } from "react-icons/im";
import { useContext, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase";
import { registerAccount } from "@/helper/login-utils";
import AuthContext from "@/store/AuthContext";
import { notification } from "antd";

export default function Register({onLogin, onCancel}){

    const [visiblePass, setVisiblePass] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [dept, setDept] = useState("");
    const [year, setYear] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState(null);

    function toggleVisiblePass(){
        setVisiblePass(!visiblePass);
    }

    const authCtx = useContext(AuthContext);

    function handleRegister(){
        // handle all validations
        if(name.trim().length === 0 || email.trim().length === 0 || college.trim().length === 0 || dept.trim().length === 0 || year.trim().length === 0 || pass.trim().length === 0){
            // setError("All fields are mandatory");
            notification['error']({
                message: `All fields are mandatory`,
                duration: 2
            })
            return;
        }
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        const isEmailValid = emailRegex.test(email);
        if(!isEmailValid){
            // setError("Invalid Email input");
            notification['error']({
                message: `Invalid email input`,
                duration: 2
            })
            return;
        }
        if(phone.trim().length !== 10){
            notification['error']({
                message: `Invalid phone no.`,
                duration: 2
            })
            return;
        }

        const isPassValid = pass.match(/[a-z]/g) && pass.match(/[A-Z]/g) && pass.match(/[0-9]/g) && pass.match(/[^a-zA-Z\d]/g) && pass.length >= 6;
        if(!isPassValid){
            notification['error']({
                message: `Password must contain atleast 1 uppercase, 1 lowercase, 1 digit & 1 special character`,
                duration: 2
            })
            return;
        }




        // registration
        // setError(null);
        createUserWithEmailAndPassword(auth , email, pass).then(async (userCredential)=>{
            const userId = email && email.split("@")[0].replace(/[.+-]/g, "_");
            await registerAccount(userId, name, email, phone, college, dept, year, pass);
            notification['success']({
                message: `Account created successfully`,
                duration: 2
            })
            
            onLogin();
            var user = auth.currentUser;
            await sendEmailVerification(user);
            notification['success']({
                message: `Email verification link sent`,
                duration: 2
            })
            authCtx.logout();
        }).catch((err)=>{
            notification['error']({
                message: `Email already registered`,
                duration: 2
            })
        })
    }

    return (
        <>
            <div className={styles.registerContainer} id="registerBox">
                <div className={styles.registerHeading}>Srijan 23 | Create Your Account</div>

                {/* {error && <div className={styles.errorBox}>
                    {error}
                </div>} */}

                <form className={styles.registerForm}>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                            <FaUserAlt className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                            <MdOutlineEmail className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="number" placeholder="Phone" value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
                            <ImMobile className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="College" value={college} onChange={(e)=>{setCollege(e.target.value)}}/>
                            <FaSchool className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="Department" value={dept} onChange={(e)=>{setDept(e.target.value)}}/>
                            <RiProfileLine className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="Year" value={year} onChange={(e)=>{setYear(e.target.value)}}/>
                            <GoBook className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type={visiblePass? "text" : "password"} placeholder="Password" value={pass} onChange={(e)=>{setPass(e.target.value)}}/>
                            <RiLockPasswordFill className={styles.registerIcon}/>
                            {!visiblePass && <AiFillEye className={styles.passViewIcon} onClick={toggleVisiblePass}/>}
                            {visiblePass && <AiFillEyeInvisible className={styles.passViewIcon} onClick={toggleVisiblePass}/>}
                        </div>
                    </div>
                    <div className={styles.rightBox}>
                        <div className={styles.registerButton} onClick={handleRegister}>Register</div>
                        <div className={styles.cancelButton} onClick={onCancel}>Cancel</div>
                    </div>
                </form>
                <div className={styles.registerLastDiv}>
                    <div>
                        Already have an account?
                        <div className={styles.registerLoginBtn} onClick={onLogin}>Login</div>    
                    </div>
                </div>
            </div>
        </>
    );
}