import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";
import {IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";
import { useState } from "react";
import {AiFillCalendar} from "react-icons/ai"
import {IoCall} from "react-icons/io5"
import parse from "html-react-parser";

const talks = [
    {
        id: 0,
        name: "talk0.jpg",
        message: `<p>
        Are you a coding enthusiast?
        <br /><br />
        Looking for some motivation to get your coding journey started? We have got you covered!
        <br /><br />
        Join us on 14 th April, 2022 to get inspired by a self-built software engineer at Google, Mr. Raj Vikramaditya(Striver. He has a YouTube channel with over 160K+ subscribers.
        <br /><br />
        He is a Candidate Master(2020) at Codeforces and 6 star at Codechef(2019) who shares knowledge on DSA.
        <br /><br />
        Striver will be there on 14th April. Will you?
        <br /><br />
        #Srijan_22<br />
        #tech_enthusiasts_assemble
    </p>`
    },
    {
        id: 1,
        name: "talk1.jpg",
        message: `<p>
        Confused and worried about Placements, College and Exams? Calm Yourselves because we are back with an exciting interactive session for you by Mr. Manish Mazumder. 
        <br /><br />
        Mr. Mazumder has his own Youtube channel with 15K+ subscribers and he was a former software developer at VMware India and his currently working on his dream project to create a great space for students. He did his M.Tech in CSE from IIT Kanpur.
        <br /><br />
        Join us in this interactive session with Mr. Manish Mazumder.
        <br /><br />
        #Srijan_22<br />
        #tech_enthusiasts_assemble
        </p>`
    },
    {
        id: 2,
        name: "talk2.jpg",
        message: `<p>
        "The secret of getting ahead is getting started." 
          <br /><br />
          Keeping this in mind, what could be a better start towards a bright future apart from registering  for this interactive session by Soumita Roy Chowdhury.
          <br /><br />
          She is specialized in business development, , account management in video, mobile and technology industry accross APAC, US and India. She is currently working at Mobilewalla, Singapore. 
          <br /><br />
          So? What are you waiting for?
          <br /><br />
          Come and join this amazing session without any further adieu.
        </p>`
    },
]

export default function Talks(){
    const [talkIndex, setTalkIndex] = useState(0);
    const goLeft = ()=>{
        if(talkIndex===0){
            setTalkIndex(2);
        }
        else{
            setTalkIndex((talkIndex-1)%3);
        }
    }
    const goRight = ()=>{
        setTalkIndex((talkIndex+1)%3);
    }
    return (
        <>
            <div className={styles.talksPage}>
                <div className={styles.talksContainer}>
                    <div className={styles.dashboardSectionHeading}>Talks</div>
                    
                    <div className={styles.talksCollection}>
                        <div className={styles.talksBox}>
                            {
                                talks.map((talk)=>{
                                    return (
                                    <div className={styles.talkSection} key={talk.id}>
                                        <Image src={`/assets/talks/${talk.name}`} height={350} width={500} alt="talkImage" className={ talk.id === talkIndex? "activeTalksImage talksImage" : "talksImage"} draggable={false}/>

                                        <div className={talkIndex === talk.id? "activeTalkBody talkBody" : "talkBody"}>
                                            <div className={styles.talkDate}>
                                                <AiFillCalendar/> 14th April
                                            </div>
                                            <div className={styles.talkCall}>
                                                <IoCall/> Suvankar Mondal (7001082597) | Navonil Sarkar (8918845868)
                                            </div>
                                            <div>{parse(talk.message)}</div>
                                            {/* <div className={styles.talkMessage} dangerouslySetInnerHTML={{__html: talk.message}}/> */}
                                        </div>
                                    </div>
                                    )
                                        
                                })
                            }
                        </div>
                        <IoIosArrowDropleft className={styles.talksArrowIconLeft} onClick={goLeft}/>
                        <IoIosArrowDropright className={styles.talksArrowIconRight} onClick={goRight}/>
                    </div>
                    <div className={styles.talksRadioBox}>
                        <input type="radio" name="talkIndex" checked={talkIndex===0} onChange={()=>setTalkIndex(0)}/>
                        <input type="radio" name="talkIndex" checked={talkIndex===1} onChange={()=>setTalkIndex(1)}/>
                        <input type="radio" name="talkIndex" checked={talkIndex===2} onChange={()=>setTalkIndex(2)}/>
                    </div>
                </div>
            </div>
        </>
    );
}