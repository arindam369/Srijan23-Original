import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import AdminProtectedRoute from "@/hoc/AdminProtectedRoute"
import styles from "../../styles/Dashboard.module.css";
import { useEffect, useState } from "react";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import UserDetailsBox from "@/components/Dashboard/UserDetailsBox";
import {IoMdSearch, IoMdClose} from "react-icons/io";
import Head from "next/head";

function UserProfiles(){
    const [users, setUsers] = useState(null);
    const [sortedUsers, setSortedUsers] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [visibleSearchBar, setVisibleSearchBar] = useState(false);

    const toggleSearchBar = ()=>{
        setSearchInput("");
        setVisibleSearchBar(!visibleSearchBar);
    }

    useEffect(()=>{
        if(users){
            setSortedUsers((users.filter( user => {
                if(searchInput.trim() === ""){
                    return user;
                }
                else if(user.profiledata && user.profiledata.name && user.profiledata.name.toLowerCase().includes(searchInput.trim().toLowerCase())){
                    return user;
                }
            })).sort((a, b)=>{
                // if(a.profiledata.name === undefined){
                //     console.log(a.profiledata);
                //     console.log(a);
                // }
                let fa = a.profiledata.name.toLowerCase(), fb = b.profiledata.name.toLowerCase();
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            }));
        }
    }, [searchInput, users])


    useEffect(()=>{
        onValue(ref_database(database, 'srijan/profiles') , (snapshot)=>{
            if(snapshot){
                let usersArray = [];
                const userDetailsArray = snapshot.val();
                for(let user in userDetailsArray){
                    usersArray.push({...userDetailsArray[user], userId: user});
                }
                usersArray.sort((a, b)=>{
                    let fa = a.profiledata.name.toLowerCase(), fb = b.profiledata.name.toLowerCase();
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                });
                setUsers(usersArray);
            }
        }, {
            onlyOnce: true
        });
    }, [])


    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="The wait is over for the 15th edition of SRIJAN, Jadavpur University, Kolkata's largest and most awaited Techno-Management Fest."
                />
                <meta
                    name="keywords"
                    content="srijan, cultural, ju, fest, srijanju, technology, events, games, coding, srijan23, techfest"
                />
                <meta name="author" content="FETSU" />
                <link rel="manifest" href="manifest.json" />
                <title>SRIJAN'23 | Admin</title>

                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="article" />
                <meta property="og:title" content="SRIJAN'23 | Jadavpur University" />
                <meta
                    property="og:description"
                    content="The wait is over for the 15th edition of SRIJAN, Jadavpur University, Kolkata's largest and most awaited Techno-Management Fest."
                />
                <meta property="og:url" content="https://srijanju.in" />
                <meta property="og:site_name" content="SRIJAN'23 | Jadavpur University" />
                <meta property="og:image" itemProp="image" content="https://srijanju.in/favicon.ico"/>
                <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
                <link rel="icon" type="image/x-icon" href="../favicon.ico" />
            </Head>
            <div className={styles.canvasContainer}>
                <Canvas>
                <Stars />
                <OrbitControls
                    enableZoom={false}
                    enableRotate={false}
                    enableDamping={false}
                    enablePan={false}
                    rotateSpeed={0.4}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
                <ambientLight intensity={1.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                </Canvas>
            </div>

            <div className={styles.dashboardPageContainer}>
                <div className={styles.dashboardSectionHeading2}>User Database</div>
                {users && <div className={styles.dashboardSectionHeading3}>{users.length} Registered</div>}
                <div className={styles.userSearchContainer}>
                    <div className={styles.userSearchBox}>
                        <div className={styles.userSearch}>
                            {<input type="text" placeholder="Search Users" className={visibleSearchBar? "visibleSearchInput visibleInput" : "visibleSearchInput"} value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}/>}
                            {!visibleSearchBar && <IoMdSearch className={styles.eventSearchIcon} onClick={toggleSearchBar}/>}
                            {visibleSearchBar && <IoMdClose className={styles.eventSearchIcon} onClick={toggleSearchBar}/>}
                        </div>
                    </div>
                </div>
                <div className={styles.userDetailsContainer}>
                    {sortedUsers && sortedUsers.length>0 && sortedUsers.map((user)=>{
                        return (
                            <UserDetailsBox name={user.profiledata.name} email={user.profiledata.email} phone={user.profiledata.phone} userId={user.userId} dept={user.profiledata.dept} college={user.profiledata.college} year={user.profiledata.year} avatar={user.profiledata.avatar} key={user.userId}/>
                        )
                    })}
                    {sortedUsers && sortedUsers.length === 0 && 
                            <div className={styles.noEventsFound}>No User Found</div>
                    }
                </div>
            </div>
        </>
    )
}

export default AdminProtectedRoute(UserProfiles);