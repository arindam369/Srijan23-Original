import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Timeline(){
    const endDate = new Date("2023-04-09").getTime() - ((5 * 60) + 30) * 60 * 1000;

    const [countdownTime, setCountdownTime] = useState(endDate - new Date().getTime());
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            setCountdownTime(endDate - new Date().getTime());
        }, 10000)
        return () => clearInterval(intervalId);
    }, [endDate]);

    useEffect(()=>{
        setDays(Math.floor(countdownTime/ (24*60*60*1000)));
        setHours(Math.floor(countdownTime%(24*60*60*1000) / (60*60*1000)));
        setMinutes(Math.floor(countdownTime%(60*60*1000) / (60*1000)));
    }, [countdownTime])

    return (
        <>
            <div className={styles.homeSectionPage2}>
                <div className={styles.homeSectionHeading}>Timeline</div>
                <div className={styles.timelineContainer}>
                    <div className={styles.timelineValue}>
                        <div style={{transform: `translateX(${days<0?"850":days===0?"650":days===1?"450":days===2?"250":days===3?"50":"0"}px)`}} className={styles.robotTitleDiv}>
                            <div timeline-title={`${days<0?"Milestone: Day 4 Reached": days===0?"Milestone: Day 3 Reached":days===1?"Milestone: Day 2 Reached": days===2?"Milestone: Day 1 Reached": days===3? "Milestone: Inauguration Ceremony":"Coming Soon..."}`} className={styles.robotDiv}>
                                <Image src={"/assets/robot.png"} height={200} width={200} alt="robot_image" className={styles.robotImage} draggable={false}  />
                            </div>
                        </div>
                        <div className={styles.timelineLabel} style={{width: `${days<0?"100":days===0 ? 75+(((1440-(hours*60)+minutes)*25)/1440) : days===1 ? 50+(((1440-(hours*60)+minutes)*25)/1440) :  days===2 ? 25+(((1440-(hours*60)+minutes)*25)/1440) : days===3 ? 0+(((1440-(hours*60)+minutes)*25)/1440) : 0 }%`}}/>
                        <div className={styles.timelineCircle1} timeline-title={"Inauguration Ceremony"}/>
                        <div className={styles.timelineCircle2} timeline-title={"Day 1 Events"}/>
                        <div className={styles.timelineCircle3} timeline-title={"Day 2 Events"}/>
                        <div className={styles.timelineCircle4} timeline-title={"Day 3 Events"}/>
                        <div className={styles.timelineCircle5} timeline-title={"Day 4 Events"}/>
                    </div>
                    <div className={styles.timelineTitles}>
                        <div className={styles.timelineTitle1}>Inauguration Ceremony</div>
                        <div className={styles.timelineTitle2}>Day 1</div>
                        <div className={styles.timelineTitle3}>Day 2</div>
                        <div className={styles.timelineTitle4}>Day 3</div>
                        <div className={styles.timelineTitle5}>Day 4</div>
                    </div>
                    <div className={styles.timelineValue2}>
                        <div className={styles.robotTitleDiv} style={{transform: `translateY(${days<0?"650":days===0?"500":days===1?"350":days===2?"200":days===3?"50":"0"}px)`}}>
                            <div timeline-title={`${days<0?"Milestone: Day 4 Reached": days===0?"Milestone: Day 3 Reached":days===1?"Milestone: Day 2 Reached": days===2?"Milestone: Day 1 Reached": days===3? "Milestone: Inauguration Ceremony":"Coming Soon..."}`}>
                                <Image src={"/assets/robot.png"} height={60} width={60} alt="robot_image" className={styles.robotImage} draggable={false}/>
                            </div>
                        </div>
                        <div className={styles.timelineLabel} style={{height: `${days<0?"100":days===0 ? 75+(((1440-(hours*60)+minutes)*25)/1440) : days===1 ? 50+(((1440-(hours*60)+minutes)*25)/1440) :  days===2 ? 25+(((1440-(hours*60)+minutes)*25)/1440) : days===3 ? 0+(((1440-(hours*60)+minutes)*25)/1440) : 0 }%`}}/>
                        <div className={styles.timelineCircle1} timeline-title={"Inauguration Ceremony"}/>
                        <div className={styles.timelineCircle2} timeline-title={"Day 1 Events"}/>
                        <div className={styles.timelineCircle3} timeline-title={"Day 2 Events"}/>
                        <div className={styles.timelineCircle4} timeline-title={"Day 3 Events"}/>
                        <div className={styles.timelineCircle5} timeline-title={"Day 4 Events"}/>
                    </div>
                    <div className={styles.timelineTitles2}>
                        <div className={styles.timelineTitle1}>Inauguration Ceremony</div>
                        <div className={styles.timelineTitle2}>Day 1</div>
                        <div className={styles.timelineTitle3}>Day 2</div>
                        <div className={styles.timelineTitle4}>Day 3</div>
                        <div className={styles.timelineTitle5}>Day 4</div>
                    </div>
                </div>
            </div>
        </>
    )
}