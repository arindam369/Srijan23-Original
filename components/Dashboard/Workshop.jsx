import styles from "../../styles/Dashboard.module.css";
import { useState } from "react";
import Image from "next/image";
import {IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";

export default function Workshop(){

    const workshops = [
        {
            id: 0,
            image: "gamedev-workshop-unity.jpg"
        },
        {
            id: 1,
            image: "workshop2.jpeg"
        },
    ]

    const [workshopIndex, setWorkshopIndex] = useState(0);
    const goLeft = ()=>{
        if(workshopIndex===0){
            setWorkshopIndex(1);
        }
        else{
            setWorkshopIndex((workshopIndex-1)%2);
        }
    }
    const goRight = ()=>{
        setWorkshopIndex((workshopIndex+1)%2);
    }

    return (
        <>
            <div className={styles.workshopContainer}>
            <div className={styles.dashboardSectionHeading}>Workshops</div>
                
                <div className={styles.workshopCollection}>
                    <div className={styles.workshopBox}>
                        {
                            workshops.map((workshop)=>{
                                return (
                                <div className={styles.workshopSection} key={workshop.id}>
                                    <Image src={`/assets/workshops/${workshop.image}`} height={350} width={500} alt="workshopImage" className={ workshop.id === workshopIndex? "activeWorkshopImage workshopImage" : "workshopImage"} draggable={false}/>
                                </div>
                                )
                                    
                            })
                        }
                    </div>
                    <IoIosArrowDropleft className={styles.talksArrowIconLeft} onClick={goLeft}/>
                    <IoIosArrowDropright className={styles.talksArrowIconRight} onClick={goRight}/>
                </div>
                <div className={styles.workshopRadioBox}>
                    <input type="radio" name="workshopIndex" checked={workshopIndex===0} onChange={()=>setWorkshopIndex(0)}/>
                    <input type="radio" name="workshopIndex" checked={workshopIndex===1} onChange={()=>setWorkshopIndex(1)}/>
                </div>

            </div>
        </>
    );
}