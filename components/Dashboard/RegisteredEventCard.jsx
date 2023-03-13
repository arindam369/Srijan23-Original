import { database } from "@/firebase";
import { onValue } from "firebase/database";
import { ref as ref_database} from "firebase/database";
import { useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";

export default function RegisteredEventCard({eventMember}){
    const [dp, setDp] = useState("/assets/anonymous.jpg");
    useEffect(()=>{
        onValue(ref_database(database, 'srijan/profiles/'+eventMember.email.split("@")[0].replace(/[.+-]/g, "_")+'/profiledata/avatar') , async (snapshot)=>{
            if(snapshot){
                if(snapshot.val() !== null){
                    setDp(snapshot.val());
                }
            }
        })
    }, [])

    return (
        <div className={styles.eventMemberBox}>
            {dp && <div data-title={eventMember.email.split("@")[0].replace(/[.+-]/g, "_")}><Image height={30} width={30} src={dp} draggable={false} alt="Image" className={styles.eventMemberDp} /></div>}
        </div>
    );
}