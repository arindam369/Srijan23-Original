import styles from "../../styles/Home.module.css";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordFill} from "react-icons/ri";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";
import Reset from "./Reset";
import AuthContext from "@/store/AuthContext";
import { updateProfile } from "@/helper/login-utils";
import { notification } from "antd";


export default function Login({onRegister, onCancel}){

    const [visiblePass, setVisiblePass] = useState(false);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState(null);
    const [visibleReset, setVisibleReset] = useState(false);

    const router = useRouter();

    const authCtx = useContext(AuthContext);

    function toggleVisiblePass(){
        setVisiblePass(!visiblePass);
    }

    async function handleLogin(){
        // handle all validations
        authCtx.startLoading();
        if(email.trim().length === 0 || pass.trim().length === 0){
            // setError("All fields are mandatory");
            // notification.error("All fields are mandatory");
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
            // setError("Invalid Email input");
            notification['error']({
                message: `Invalid email input`,
                duration: 2
            })
            authCtx.stopLoading();
            return;
        }

        // login
        setError(null);
        signInWithEmailAndPassword(auth, email, pass).then(async (userCredentials)=>{
            if(!userCredentials.user.emailVerified){
                authCtx.logout();
                // setError("Email not verified yet");
                notification['error']({
                    message: `Email not verified yet`,
                    duration: 2
                })
                authCtx.stopLoading();
                return;
            }
            else{
                const userId = email.split("@")[0].replace(/[.+-]/g, "_");
                await updateProfile(userId, "isVerified", true, authCtx.stopLoading);
                // authCtx.stopLoading();
                router.push("/dashboard");
            }
        
        }).catch((err)=>{
            notification['error']({
                message: `Wrong email or password`,
                duration: 2
            })
            authCtx.stopLoading();
        })
    }

    return (
        <>
            {!visibleReset && <div className={styles.registerContainer} id="registerBox">
                <div className={styles.registerHeading}>Srijan 23 | Login Your Account</div>
                
                {/* {error && <div className={styles.errorBox}>
                    {error}
                </div>} */}

                <form className={styles.registerForm}>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                            <MdOutlineEmail className={styles.registerIcon}/>
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
                        <div className={styles.registerButton} onClick={handleLogin}>Login</div>
                        <div className={styles.cancelButton} onClick={onCancel}>Cancel</div>
                    </div>
                </form>
                <div className={styles.registerLastDiv}>
                    <div>
                        Don't have an account?
                        <div className={styles.registerLoginBtn} onClick={onRegister}>Register</div>
                    </div>

                    <div className={styles.forgotPassButton} onClick={()=>{setVisibleReset(true)}}>Forgot password?</div>
                </div>
            </div>
            }
            {visibleReset && <Reset/>}
        </>
    );
}