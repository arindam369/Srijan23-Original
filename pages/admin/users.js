import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import AdminProtectedRoute from "@/hoc/AdminProtectedRoute"
import styles from "../../styles/Dashboard.module.css";
import { useEffect, useState } from "react";
import { onValue, ref as ref_database } from "firebase/database";
import { database } from "@/firebase";
import UserDetailsBox from "@/components/Dashboard/UserDetailsBox";
import {IoMdSearch, IoMdClose} from "react-icons/io";

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
            setSortedUsers(users.filter( user => {
                if(searchInput.trim() === ""){
                    return user;
                }
                else if(user.profiledata && user.profiledata.name && user.profiledata.name.toLowerCase().includes(searchInput.trim().toLowerCase())){
                    return user;
                }
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
                setUsers(usersArray);
            }
        }, {
            onlyOnce: true
        });
    }, [])


    return (
        <>
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
                            <UserDetailsBox name={user.profiledata.name} email={user.profiledata.email} userId={user.userId} dept={user.profiledata.dept} college={user.profiledata.college} year={user.profiledata.year} avatar={user.profiledata.avatar} key={user.userId}/>
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