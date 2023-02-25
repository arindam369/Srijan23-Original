import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Countdown(){

    const countdownDate = new Date("2023-03-16").getTime() - ((5 * 60) + 30) * 60 * 1000;

    const [countdownTime, setCountdownTime] = useState(countdownDate - new Date().getTime());
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            setCountdownTime(countdownDate - new Date().getTime());
        }, 1000)
        return () => clearInterval(intervalId);
    }, [countdownDate]);

    useEffect(()=>{
        setDays(Math.floor(countdownTime/ (24*60*60*1000)));
        setHours(Math.floor(countdownTime%(24*60*60*1000) / (60*60*1000)));
        setMinutes(Math.floor(countdownTime%(60*60*1000) / (60*1000)));
        setSeconds(Math.floor(countdownTime%(60*1000) / (1000)));
    }, [countdownTime])



    return (
        <>
            <div className={styles.countdownContainer}>

                <div className={styles.countDownBox}>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={(days*100)/365} text={days>9?`${days} Days`:(days<=1?`0${days} Day`:`0${days} Days`)} styles={buildStyles({
                            textSize: '13px',
                            textColor: '#f88',
                            pathColor: '#f88'
                        })}/>
                    </div>
                </div>
                
                <div className={styles.countDownBox}>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={(hours*100)/24} text={hours>9?`${hours} Hours`:(hours<=1?`0${hours} Hour`:`0${hours} Hours`)} styles={buildStyles({
                            textSize: '13px',
                            textColor: '#A020F0',
                            pathColor: '#A020F0',
                        })}/>
                    </div>
                </div>
                <div className={styles.countDownBox}>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={(minutes*100)/60} text={minutes>9?`${minutes} Minutes`:(minutes<=1?`0${minutes} Minute`:`0${minutes} Minutes`)} styles={buildStyles({
                            textSize: '13px',
                            textColor: '#FFD700',
                            pathColor: '#FFD700',
                        })}/>
                    </div>
                </div>
                <div className={styles.countDownBox}>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={(seconds*100)/60} text={seconds>9?`${seconds} Seconds`:(seconds<=1?`0${seconds} Second`:`0${seconds} Seconds`)} styles={buildStyles({
                            textSize: '12px',
                            textColor: '#14A44D',
                            pathColor: '#14A44D',
                        })}/>
                    </div>
                </div>
            </div>
        </>
    )
}
