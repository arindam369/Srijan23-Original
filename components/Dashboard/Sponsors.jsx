import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../../styles/Dashboard.module.css";

export default function Sponsors(){
    const [visiblePlatinum, setVisiblePlatinum] = useState(false);
    const [visibleSilver, setVisibleSilver] = useState(false);
    const [visibleDating, setVisibleDating] = useState(false);
    const [visibleFood, setVisibleFood] = useState(false);
    const [visibleEducation, setVisibleEducation] = useState(false);

    const showPlatinum = ()=>{
        setVisiblePlatinum(true);
        setVisibleSilver(false);
        setVisibleDating(false);
        setVisibleFood(false);
        setVisibleEducation(false);
    }
    const showSilver = ()=>{
        setVisiblePlatinum(false);
        setVisibleSilver(true);
        setVisibleDating(false);
        setVisibleFood(false);
        setVisibleEducation(false);
    }
    const showDating = ()=>{
        setVisiblePlatinum(false);
        setVisibleSilver(false);
        setVisibleDating(true);
        setVisibleFood(false);
        setVisibleEducation(false);
    }
    const showFood = ()=>{
        setVisiblePlatinum(false);
        setVisibleSilver(false);
        setVisibleDating(false);
        setVisibleFood(true);
        setVisibleEducation(false);
    }
    const showEducation = ()=>{
        setVisiblePlatinum(false);
        setVisibleSilver(false);
        setVisibleDating(false);
        setVisibleFood(false);
        setVisibleEducation(true);
    }
    useEffect(()=>{
        showPlatinum();
    }, [])

    return (
        <>
            <div className={styles.sponsorsContainer}>
                <div className={styles.dashboardSectionHeading}>Sponsors</div>

                <div className={styles.sponsorSection}>
                    <div className={styles.sponsorBody}>
                        <div className={styles.sponsorTypes}>
                            <li onClick={showPlatinum} className={visiblePlatinum? "sponsorBullet sponsorSelectedBullet" : "sponsorBullet"}>
                                <Image src={"/assets/icons/platinum.png"} height={30} width={30} alt="sponsorIcon" className={styles.sponsorIcon} draggable={false}/>
                                {visiblePlatinum && <div className={styles.sponsorTitle}>Platinum Sponsors</div>}
                            </li>
                            <li onClick={showSilver} className={visibleSilver? "sponsorBullet sponsorSelectedBullet" : "sponsorBullet"}>
                            <Image src={"/assets/icons/silver.png"} height={30} width={30} alt="sponsorIcon" className={styles.sponsorIcon} draggable={false}/>
                                {visibleSilver && <div className={styles.sponsorTitle}>Silver Sponsors</div>}
                            </li>
                            <li onClick={showDating} className={visibleDating? "sponsorBullet sponsorSelectedBullet" : "sponsorBullet"}>
                            <Image src={"/assets/icons/dating.png"} height={30} width={30} alt="sponsorIcon" className={styles.sponsorIcon} draggable={false}/>
                                {visibleDating && <div className={styles.sponsorTitle}>Official Dating Partners</div>}
                            </li>
                            <li onClick={showFood} className={visibleFood? "sponsorBullet sponsorSelectedBullet" : "sponsorBullet"}>
                            <Image src={"/assets/icons/food.png"} height={30} width={30} alt="sponsorIcon" className={styles.sponsorIcon} draggable={false}/>
                                {visibleFood && <div className={styles.sponsorTitle}>Official Food Partners</div>}
                            </li>
                            <li onClick={showEducation} className={visibleEducation? "sponsorBullet sponsorSelectedBullet" : "sponsorBullet"}>
                            <Image src={"/assets/icons/education.png"} height={30} width={30} alt="sponsorIcon" className={styles.sponsorIcon} draggable={false}/>
                                {visibleEducation && <div className={styles.sponsorTitle}>Official Education Partners</div>}
                            </li>
                        </div>
                    </div>
                

                    <div className={styles.sponsorCollection}>
                        {visiblePlatinum && <div className={styles.sponsorBox}>
                            <a href="https://www.mobilewalla.com" target="_blank" rel="noopener noreferrer">
                            <Image src={"/assets/sponsors/mobilewalla.svg"} height={80} width={400} alt="mobilewalla_logo" draggable={false} id="mobilewalla" /> </a>
                        </div>}

                        {visibleSilver && <div className={styles.sponsorBox}>
                        <a href="https://webelfujisoftvara.com" target="_blank" rel="noopener noreferrer">
                            <Image src={"/assets/sponsors/Webel2.png"} height={180} width={360} alt="webel_logo" className={styles.sponsorImage} draggable={false} id="webel"/> </a>
                        </div>}

                        {visibleDating && <div className={styles.sponsorBox}>
                        <a href="https://flutrr.com" target="_blank" rel="noopener noreferrer">
                            <Image src={"/assets/sponsors/Flutrr.png"} height={220} width={260} alt="flutrr_logo" className={styles.sponsorImage} draggable={false} id="flutrr"/> </a>
                        </div>}


                        {visibleFood && <div className={styles.sponsorBox}>
                        
                            <Image src={"/assets/sponsors/wowmomo.jpg"} height={150} width={150} alt="WowMomo_logo" className={styles.sponsorImage} draggable={false} id="wowMomo"/>
                            <Image src={"/assets/sponsors/foodporium.jpeg"} height={150} width={150} alt="foodporium_logo" className={styles.sponsorImage} draggable={false} id="foodporium"/>
                            <Image src={"/assets/sponsors/4thstreet.jpeg"} height={150} width={150} alt="4thStreet_logo" className={styles.sponsorImage} draggable={false} id="street4th"/>
                            <a href="https://www.pizzahut.co.in" target="_blank" rel="noopener noreferrer">
                            <Image src={"/assets/sponsors/pizzahut.jpeg"} height={150} width={150} alt="PizzaHut_logo" className={styles.sponsorImage} draggable={false} id="pizzaHut"/> </a>
                        </div>}


                        {visibleEducation && <div className={styles.sponsorBox}>
                        <a href="https://interviewbuddy.in" target="_blank" rel="noopener noreferrer">
                            <Image src={"/assets/sponsors/InterviewBuddy.png"} height={200} width={480} alt="InterviewBuddy_logo" className={styles.sponsorImage} draggable={false} id="interviewBuddy"/>
                            </a>
                        </div>}

                    </div>

                </div>
            </div>
        </>
    );
}