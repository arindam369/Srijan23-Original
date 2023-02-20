import { db, database } from "@/firebase";
import { notification } from "antd";
import { set, ref as ref_database, get, child, onValue, update, remove} from "firebase/database";


export async function registerAccount(userId, name, email, phone, college, dept, year){
    set(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
        name: name,
        email: email,
        phone: phone,
        college: college,
        dept: dept,
        year: year
    }).then((res) => {
        // console.log("User registrated successfully!");
    })
    .catch((err) => {
        // console.log(err);
        // console.log("User Registration failed...");
    });
}
export async function registerUsingGoogleAccount(userId, name, email){
    update(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
        name: name,
        email: email,
        isVerified: true
    }).then((res) => {
        // console.log("User registrated successfully!");
    })
    .catch((err) => {
        // console.log(err);
        // console.log("User Registration failed...");
    });
}
export async function updateProfile(userId, dataType, newData){
    update(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
        [dataType]: newData
    }).then((res)=>{
        // console.log("Profile updated successfully");
    }).catch((err)=>{
        // console.log("Profile updation failed...");
    })
}

export async function makeEventInterested(userId, eventId, eventName){
    set(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents' + `/${eventId}`), {
        eventName: eventName
    }).then(()=>{
        // console.log("This event is made interested");
    }).catch((err)=>{
        // console.log("Making of this event as interested is failed");
        // console.log(err);
    })
}
export async function makeEventUnInterested(userId, eventId, eventName){
    remove(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents' + `/${eventId}`)).then(()=>{
        // console.log("This event is made interested");
    }).catch((err)=>{
        // console.log("Making of this event as interested is failed");
        // console.log(err);
    })
}
export const getAllInterestedEvents = (userId)=>{
    return onValue(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents') , (snapshot)=>{
        // console.log(snapshot && snapshot.val());
        return snapshot.val();
    }, {
        onlyOnce: true
    });
}
export async function bookMerchandise(fullname, email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod){
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");

    onValue(ref_database(database, 'srijan/merchandise/'+userId), (snapshot) => {
        if(snapshot.val() !== null){
            notification['error']({
                message: `You have already placed an order`,
                duration: 2
            })
            return;
        }
        else{
            set(ref_database(database, 'srijan/merchandise/' + userId), { fullname, email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod}
            ).then((res) => {
                // console.log("Merchandise Booked successfully!");
                notification['success']({
                    message: `Order placed successfully`,
                    duration: 2
                })
            })
            .catch((err) => {
                // console.log("Booking failed for Merchandise...");
                notification['error']({
                    message: `Order failed for merchandise`,
                    duration: 2
                })
            });
        }
    }, {
        onlyOnce: true
    });
}


export async function registerEvent(eventId, teamName, teamLeaderEmail, teamLeaderPhone, member2, member3, member4, member5, eventName){
    try{
        let isOkay = true;
        onValue(ref_database(database, 'srijan/events/'+eventId+'/teams/'+teamName) , async (snapshot)=>{
            if(snapshot){
                if(snapshot.val() !== null){
                    notification['error']({
                        message: `A team with the name '${teamName}' already exists`,
                        duration: 2
                    })
                    isOkay=false;
                    return;
                }

                const teamNameRegex = /^[a-zA-Z0-9]{3,16}$/;
                if (!teamNameRegex.test(teamName)) {
                    notification['error']({
                        message: `Invalid team name. Team name should be 3-16 letters long and should contain letters or numbers`,
                        duration: 2
                    })
                    isOkay=false;
                    return;
                }

                const emails = [teamLeaderEmail, member2, member3, member4, member5].filter(email => email !== "");
                const duplicates = [...new Set(emails.filter((item, index) => emails.indexOf(item) !== index))];
                if (duplicates.length > 0) {
                    notification['error']({
                        message: `Duplicate email found`,
                        duration: 2
                    })
                    isOkay=false;
                    return;
                }
                // teamLeader has accepted the invitation
                set(ref_database(database, 'srijan/profiles/' + teamLeaderEmail.split("@")[0] + '/events' + `/${eventId}`), {
                    eventName: eventName,
                    status: true
                })

                const teamDetails = {
                    teamName: teamName,
                    leadEmail: teamLeaderEmail,
                    leadContact: teamLeaderPhone,
                    members: {
                        0: {
                            email: teamLeaderEmail
                        }
                    },
                }
                if(member2.trim().length > 0){
                    const memberId2 = member2.split("@")[0];
                    onValue(ref_database(database, 'srijan/profiles/' + memberId2), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member2}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId2+"/events/"+eventId), (snapshot) => {
                            const eventFound = (snapshot.val() && snapshot.val().profiledata) || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member2} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[1] = {
                            email: member2
                        }
                        set(ref_database(database, 'srijan/profiles/' + member2.split("@")[0] + '/events' + `/${eventId}`), {
                            eventName: eventName,
                            status: false
                        })
                    }, {
                        onlyOnce: true
                    });
                }
                if(member3.trim().length > 0){
                    const memberId3 = member3.split("@")[0];
                    onValue(ref_database(database, 'srijan/profiles/' + memberId3), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member3}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId3+"/events/"+eventId), (snapshot) => {
                            const eventFound = (snapshot.val() && snapshot.val().profiledata) || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member3} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[2] = {
                            email: member3
                        }
                        set(ref_database(database, 'srijan/profiles/' + member3.split("@")[0] + '/events' + `/${eventId}`), {
                            eventName: eventName,
                            status: false
                        })
                    }, {
                        onlyOnce: true
                    });
                }
                if(member4.trim().length > 0){
                    const memberId4 = member4.split("@")[0];
                    onValue(ref_database(database, 'srijan/profiles/' + memberId4), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member4}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId4+"/events/"+eventId), (snapshot) => {
                            const eventFound = (snapshot.val() && snapshot.val().profiledata) || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member4} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[3] = {
                            email: member4
                        }
                        set(ref_database(database, 'srijan/profiles/' + member4.split("@")[0] + '/events' + `/${eventId}`), {
                            eventName: eventName,
                            status: false
                        })
                    }, {
                        onlyOnce: true
                    });
                }
                if(member5.trim().length > 0){
                    const memberId5 = member5.split("@")[0];
                    onValue(ref_database(database, 'srijan/profiles/' + memberId5), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member5}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId5+"/events/"+eventId), (snapshot) => {
                            const eventFound = (snapshot.val() && snapshot.val().profiledata) || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member5} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[4] = {
                            email: member5
                        }
                        set(ref_database(database, 'srijan/profiles/' + member5.split("@")[0] + '/events' + `/${eventId}`), {
                            eventName: eventName,
                            status: false,
                        })
                    }, {
                        onlyOnce: true
                    });
                }
                setTimeout(async ()=>{
                    if(isOkay){
                        await set(ref_database(database, 'srijan/events/'+eventId+"/teams/"+teamName), {
                            eventName: eventName,
                            isRegistered: false,
                            teamDetails: teamDetails
                        }).then(()=>{
                            console.log("ha");
                        })
                    }
                }, 10000);
            }
        }, {
            onlyOnce: true
        });
    }
    catch(err){
        console.log(err);
    }
}