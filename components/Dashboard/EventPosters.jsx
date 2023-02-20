import styles from "../../styles/Dashboard.module.css";
import { useState } from "react";
import Image from "next/image";
import {IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";

export default function EventPosters(){

    const eventPosters = [
        {
            id: 0,
            image: "gamedev-workshop-unity.jpg"
        },
        {
            id: 1,
            image: "workshop2.jpeg"
        },
    ]

    const [eventPosterIndex, setEventPosterIndex] = useState(0);
    const goLeft = ()=>{
        if(eventPosterIndex===0){
            setEventPosterIndex(1);
        }
        else{
            setEventPosterIndex((eventPosterIndex-1)%2);
        }
    }
    const goRight = ()=>{
        setEventPosterIndex((eventPosterIndex+1)%2);
    }

    return (
        <>
            <div className={styles.workshopContainer}>
                
                <div className={styles.workshopCollection}>
                    <div className={styles.workshopBox}>
                        {
                            eventPosters.map((eventPoster)=>{
                                return (
                                <div className={styles.workshopSection} key={eventPoster.id}>
                                    <Image src={`/assets/workshops/${eventPoster.image}`} height={350} width={500} alt="eventPosterImage" className={ eventPoster.id === eventPosterIndex? "activeWorkshopImage workshopImage" : "workshopImage"} draggable={false}/>
                                </div>
                                )
                                    
                            })
                        }
                    </div>
                    <IoIosArrowDropleft className={styles.talksArrowIconLeft} onClick={goLeft}/>
                    <IoIosArrowDropright className={styles.talksArrowIconRight} onClick={goRight}/>
                </div>
                <div className={styles.eventsRadioBox}>
                    <input type="radio" checked={eventPosterIndex===0} onChange={()=>setEventPosterIndex(0)}/>
                    <input type="radio" checked={eventPosterIndex===1} onChange={()=>setEventPosterIndex(1)}/>
                </div>

            </div>
        </>
    );
}