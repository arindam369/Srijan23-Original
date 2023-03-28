import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { database } from "@/firebase";
import { onValue, ref as ref_database } from "firebase/database";
import { getEventById } from "@/helper/event-utils";
import { registerUsingGoogleAccount } from "@/helper/login-utils";
import { notification } from "antd";


const AuthContext = React.createContext({
    userId: "",
    userData: "",
    isAuthenticated: "",
    updateAuthenticationStatus: (isUserAuthenticated)=>{},
    updateUserData: (userData)=>{},
    interestedEvents: "",
    registeredEvents: "",
    isLoading: "",
    startLoading: ()=>{},
    stopLoading: ()=>{},
    logout: ()=>{},
    updateUserProfile: ()=>{},
    googleSignIn: ()=>{},
    refetchInterestedEvents: ()=>{}
});

export const AuthContextProvider = (props)=>{
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [interestedEvents, setInterestedEvents] = useState(null);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = ()=>{
        setIsLoading(true);
    }
    const stopLoading = ()=>{
        setIsLoading(false);
    }
    
    const updateAuthenticationStatus = (isUserAuthenticated)=>{
        setIsAuthenticated(isUserAuthenticated);
    }
    const updateUserData = (userData)=>{
        setUserData(userData);
    }
    const updateUserProfile = (dataType, data)=>{
        setUserData((prevUserData)=>({...prevUserData, [dataType]: data}));
    }
    const logout = ()=>{
        signOut(auth);
    }

    const googleSignIn = ()=>{
        startLoading();
        const googleProvider = new GoogleAuthProvider();
        signInWithRedirect(auth, googleProvider);
    }


    useEffect(()=>{
        onAuthStateChanged(auth, async (user)=>{
            if(user){
                startLoading();
                const userId = user.email && user.email.split("@")[0].replace(/[.+-]/g, "_");
                setUserId(userId);
                const provider = user.providerData[0].providerId;
                if(provider === "google.com"){
                    const name = user.displayName;
                    const email = user.email;
                    await registerUsingGoogleAccount(userId, name, email);
                }
                notification['success']({
                    message: `Logged in as ${userId}`,
                    duration: 2
                })
            }
            else{
                setUserId(null);
                setIsAuthenticated(false);
            }
        })
    }, [auth])


    useEffect(()=>{
        if(userId){
            onValue(ref_database(database, 'srijan/profiles/' + userId), (snapshot) => {
                const userDetails = (snapshot.val() && snapshot.val().profiledata) || null;
                if(userDetails && userDetails.isVerified === true){
                    setUserData(userDetails);
                    setIsAuthenticated(true);
                    stopLoading();
                }
            }, {
                onlyOnce: true
            });
        }
    }, [userId])

    useEffect(()=>{
        if(userId){
            let interestedEventsArray = [];
            onValue(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents') , (snapshot)=>{
                if(snapshot){
                    const interestedEvents = snapshot.val();
                    for(let interestedEventId in interestedEvents){
                        const eventDetails = getEventById(interestedEventId);
                        interestedEventsArray.push(eventDetails);
                    }
                    setInterestedEvents(interestedEventsArray);
                    stopLoading();
                }
            }, {
                onlyOnce: true
            });
        }
    }, [userId])
    useEffect(()=>{
        if(userId){
            let registeredEventsArray = [];
            onValue(ref_database(database, 'srijan/profiles/' + userId + '/events') , (snapshot)=>{
                if(snapshot){
                    const interestedEvents = snapshot.val();
                    for(let registeredEventId in interestedEvents){
                        const eventDetails = getEventById(registeredEventId);
                        registeredEventsArray.push(eventDetails);
                    }
                    setRegisteredEvents(registeredEventsArray);
                    stopLoading();
                }
            }, {
                onlyOnce: true
            });
        }
    }, [userId])

    const refetchInterestedEvents = ()=>{
        if(userId){
            let interestedEventsArray = [];
            onValue(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents') , (snapshot)=>{
                if(snapshot){
                    const interestedEvents = snapshot.val();
                    for(let interestedEventId in interestedEvents){
                        const eventDetails = getEventById(interestedEventId);
                        interestedEventsArray.push(eventDetails);
                    }
                    setInterestedEvents(interestedEventsArray);
                    stopLoading();
                }
            }, {
                onlyOnce: true
            });
        }
    }

    const authContext = {
        userId: userId,
        userData, userData,
        isAuthenticated: isAuthenticated,
        updateAuthenticationStatus: updateAuthenticationStatus,
        updateUserData: updateUserData,
        logout: logout,
        interestedEvents: interestedEvents,
        registeredEvents: registeredEvents,
        isLoading: isLoading,
        startLoading: startLoading,
        stopLoading: stopLoading,
        updateUserProfile: updateUserProfile,
        googleSignIn: googleSignIn,
        refetchInterestedEvents: refetchInterestedEvents
    }

    return <AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>
}

export default AuthContext;