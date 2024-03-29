import styles from "../../styles/Dashboard.module.css";
import {BsFillInfoCircleFill} from "react-icons/bs";
import { useState } from "react";
import {MdOutlineEmail} from "react-icons/md";
import {HiUserGroup} from "react-icons/hi";
import {ImMobile} from "react-icons/im";
import {FaUserPlus} from "react-icons/fa";
import { useContext } from "react";
import AuthContext from "@/store/AuthContext";
import { registerEvent } from "@/helper/login-utils";
import { notification } from "antd";

export default function EventRegistration({eventName, eventId, minMembers, maxMembers, toggleVisibleRegistrationForm, onRegister}){

    const [teamName, setTeamName] = useState("");
    const [teamLeaderMobile, setTeamLeaderMobile] = useState("");
    const [teamMemberEmail2, setTeamMemberEmail2] = useState("");
    const [teamMemberEmail3, setTeamMemberEmail3] = useState("");
    const [teamMemberEmail4, setTeamMemberEmail4] = useState("");
    const [teamMemberEmail5, setTeamMemberEmail5] = useState("");
    const [memberIndex, setMemberIndex] = useState(minMembers);
    // const [error, setError] = useState(null);

    const authCtx = useContext(AuthContext);
    const userData = authCtx.userData;

    const addMember = ()=>{
        if(memberIndex>maxMembers-1){
            return;
        }
        setMemberIndex(memberIndex+1);
    }
    const handleSubmitRegistration = (e)=>{
        e.preventDefault();
        authCtx.startLoading();
        // handle all validations
        const data = {
            teamName: teamName.trim(),
            teamLeaderMobile: teamLeaderMobile.trim(),
            teamLeaderEmail: userData.email.trim(),
            teamMemberEmail2: teamMemberEmail2.trim(),
            teamMemberEmail3: teamMemberEmail3.trim(),
            teamMemberEmail4: teamMemberEmail4.trim(),
            teamMemberEmail5: teamMemberEmail5.trim()
        };
        if(data.teamName.length === 0){
            // setError("You must provide a Team name");
            notification['error']({
                message: `You must provide a Team name`,
                duration: 4
            })
            authCtx.stopLoading();
            return;
        }
        const teamNameRegex = /^[a-zA-Z0-9]{3,16}$/;
        if (!teamNameRegex.test(teamName)) {
            notification['error']({
                message: `Invalid team name. Team name should be 3-16 letters long and should contain letters or numbers`,
                duration: 5
            })
            authCtx.stopLoading();
            return;
        }
        if(data.teamName.indexOf(' ')>=0){
            // setError("Team name must not contain any whitespace");
            notification['error']({
                message: `Team name must not contain any whitespace`,
                duration: 4
            })
            authCtx.stopLoading();
            return;
        }
        if(data.teamLeaderEmail.length === 0){
            // setError("You must provide your email");
            notification['error']({
                message: `You must provide your email`,
                duration: 4
            })
            authCtx.stopLoading();
            return;
        }
        if(data.teamLeaderMobile.length === 0){
            // setError("You must provide your mobile no");
            notification['error']({
                message: `You must provide your mobile no.`,
                duration: 4
            })
            authCtx.stopLoading();
            return;
        }
        
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if(!emailRegex.test(data.teamLeaderEmail) || (teamMemberEmail2.length>0 && !emailRegex.test(data.teamMemberEmail2)) || (teamMemberEmail3.length>0 && !emailRegex.test(data.teamMemberEmail3)) || (teamMemberEmail4.length>0 && !emailRegex.test(data.teamMemberEmail4)) || (teamMemberEmail5.length>0 && !emailRegex.test(data.teamMemberEmail5))){
            // setError("Invalid Email input");
            notification['error']({
                message: `Invalid email input`,
                duration: 3
            })
            authCtx.stopLoading();
            return;
        }
        // setError(null);

        if(!authCtx.userData.name ||!authCtx.userData.email || !authCtx.userData.phone || !authCtx.userData.college || !authCtx.userData.dept || !authCtx.userData.year){
            notification['error']({
                message: `Complete your profile first to register in an event`,
                duration: 5
            })
            authCtx.stopLoading();
            return;
        }

        // handle event registration
        setTeamName("");
        setTeamLeaderMobile("");
        setTeamMemberEmail2("");
        setTeamMemberEmail3("");
        setTeamMemberEmail4("");
        setTeamMemberEmail5("");
        toggleVisibleRegistrationForm();
        try{
            registerEvent(eventId, data.teamName, data.teamLeaderEmail, data.teamLeaderMobile, data.teamMemberEmail2, data.teamMemberEmail3, data.teamMemberEmail4, data.teamMemberEmail5, eventName)
            setTimeout(()=>{
                authCtx.stopLoading();
                onRegister();
            }, 10000)
        }catch(err){
            authCtx.stopLoading();
        }
        
    }
    

    return (
        <>
            <h2 className={styles.eventRegistrationHeading}>{eventName}</h2>
            <div className={styles.eventRegistrationDescription}>
                <BsFillInfoCircleFill className={styles.eventRegistrationDescIcon}/>
                <div> &emsp; &nbsp;A team for this event consists of a minimum of {minMembers} {minMembers===1?"member":"members"} and a maximum of {maxMembers} {maxMembers===1?"member":"members"}. Fill the remaining input fields with the emails of your team members (according to your team size) otherwise leave it blank.</div>
            </div>
            <div className={styles.eventRegistrationFormBox}>
                {/* {error && <div className={styles.errorBox}>
                    {error}
                </div>} */}
                <form className={styles.eventRegistrationForm} onSubmit={handleSubmitRegistration}>
                    <div className={styles.eventRegistrationInput}>
                        <HiUserGroup className={styles.eventRegistrationInputIcon}/>
                        <input type="text" placeholder="Team Name [No Space Allowed]" value={teamName} onChange={(e)=>{setTeamName(e.target.value)}}/>
                    </div>
                    <div className={styles.eventRegistrationInputDisabled}>
                        <MdOutlineEmail className={styles.eventRegistrationInputIcon}/>
                        <input type="email" placeholder="Team Leader Email" value={userData && userData.email} disabled/>
                    </div>
                    <div className={styles.eventRegistrationInput}>
                        <ImMobile className={styles.eventRegistrationInputIcon}/>
                        <input type="number" placeholder="Team Leader Mobile No" value={teamLeaderMobile} onChange={(e)=>{setTeamLeaderMobile(e.target.value)}}/>
                    </div>
                    {
                        memberIndex > 1 && <div className={styles.eventRegistrationInput}>
                        <MdOutlineEmail className={styles.eventRegistrationInputIcon}/>
                        <input type="text" placeholder="Team Member 2 Email" value={teamMemberEmail2} onChange={(e)=>{setTeamMemberEmail2(e.target.value)}} required/>
                        </div>
                    }
                    { memberIndex > 2 && <div className={styles.eventRegistrationInput}>
                        <MdOutlineEmail className={styles.eventRegistrationInputIcon}/>
                        <input type="text" placeholder="Team Member 3 Email" value={teamMemberEmail3} onChange={(e)=>{setTeamMemberEmail3(e.target.value)}} required/>
                    </div>}
                    { memberIndex > 3 && <div className={styles.eventRegistrationInput}>
                        <MdOutlineEmail className={styles.eventRegistrationInputIcon}/>
                        <input type="text" placeholder="Team Member 4 Email" value={teamMemberEmail4} onChange={(e)=>{setTeamMemberEmail4(e.target.value)}} required/>
                    </div>}
                    { memberIndex > 4 && <div className={styles.eventRegistrationInput}>
                        <MdOutlineEmail className={styles.eventRegistrationInputIcon}/>
                        <input type="text" placeholder="Team Member 5 Email" value={teamMemberEmail5} onChange={(e)=>{setTeamMemberEmail5(e.target.value)}} required/>
                    </div>}
                    
                    <button type="button" className={memberIndex>maxMembers-1? "addMemberButton disabledAddMemberButton" : "addMemberButton"} onClick={addMember}>
                        <FaUserPlus/>
                        <div>Add Member</div>
                    </button>
                    
                    <br /><br />
                    <div className={styles.eventRegistrationButtonBox}>
                        <button className={styles.eventRegistrationRegisterButton}>Register</button>
                    </div>

                </form>
            </div>
        </>
    )
}