import styles from "../../styles/Home.module.css";
import {MdOutlineEmail} from "react-icons/md";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";
import { notification } from "antd";

export default function Reset({onRegister, onCancel}){

    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [visibleResult, setVisibleResult] = useState(null);

    const router = useRouter();

    function handleReset(){
        // handle all validations
        if(email.trim().length === 0){
            // setError("Please enter your email");
            notification['error']({
                message: `Please enter your email`,
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

        // reset password
        sendPasswordResetEmail(auth, email).then(()=>{
            setVisibleResult(true);
        }).catch((err)=>{
            // console.log(err);
            // setError("No account found with this email");
            notification['error']({
                message: `No account found with this email`,
                duration: 2
            })
            setVisibleResult(null);
        })
    }

    return (
        <>
            <div className={styles.registerContainer} id="registerBox">
                <div className={styles.registerHeading}>Srijan 23 | Reset Password</div>
                
                {/* {error && <div className={styles.errorBox}>
                    {error}
                </div>} */}

                {!visibleResult && <form className={styles.registerForm}>
                    <div className={styles.registerInputBox}>
                        <div className={styles.registerInput}>
                            <input type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                            <MdOutlineEmail className={styles.registerIcon}/>
                        </div>
                    </div>
                    <div className={styles.rightBox}>
                        <div className={styles.registerButton} onClick={handleReset}>Reset Password</div>
                    </div>
                </form>}

                {visibleResult && <div className={styles.resetResultBox}>
                    Password reset link has been generated and sent to the registered email account
                </div>}
            </div>
        </>
    );
}